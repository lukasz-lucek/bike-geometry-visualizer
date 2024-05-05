
import React, { useState } from 'react';
import { defaultFixedCircles, defaultFixedRectangles, defaultOffsetFixedRectangles, defaultPolygons, defaultSemiFixedRectangles, GeometryState, useGeometryContext } from '../../contexts/GeometryContext';
import DropdownActions from './DropdownActions';
import GeometryStatesSerializer, { GeometryStateSerializer, GeompetryPayloadSerializer } from '../../contexts/GeometryStatesSerilizer';
import { OffsetSpline } from '../../interfaces/Spline';
import { defauleHandlebarMeasures } from '../../contexts/MeasurementsContext';
import axios from 'axios';
import { sha256 } from '../../utils/Sha256Utils';
import { IBikeData } from '../../IGeometryState';

const GeometrySaver = () => {
  const [bikeDataName, setBikeDataName] = useState('');

  const [bikeMake, setBikeMake] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [bikeYear, setBikeYear] = useState(2020);

  const {
    state: [state, updateState],
  } = useGeometryContext();

  const saveGeometry = () => {
    if (bikeDataName != '') {
      const geomStatSerializer = new GeometryStatesSerializer();
      const knownGeometriesRaw = localStorage.getItem('knownGeometries');
      if (knownGeometriesRaw) {
        geomStatSerializer.deserialize(knownGeometriesRaw)
      }
      let {bikesList: _, ...toSave} = state;
      geomStatSerializer.knownGeometries.set(bikeDataName, {bikesList: [], ...toSave})

      localStorage.setItem('knownGeometries', geomStatSerializer.serialize());
      updateState({ bikesList: Array.from(geomStatSerializer.knownGeometries.keys()) });
    }
  }

  const sendGeometryUpstream = async () => {
    console.log(`sending upstream bike: ${bikeMake}, ${bikeModel}, ${bikeYear}`);
    const payload : IBikeData = {
      make: bikeMake,
      model: bikeModel,
      year: bikeYear,
      user: '',
      isPublic: false,
      data: state,
    }
    const serializer = new GeompetryPayloadSerializer(payload)
    const prepPayload = serializer.serialize();

    const address = process.env.REACT_APP_SERVER_ADDRESS || '';
    const endpoint = address + '/api/send-upstream'

    const token = localStorage.getItem('jwt');
    axios.post(endpoint, prepPayload, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }).then(function (resp) {
      console.log(resp);
    }).catch(function (error) {
      console.log(error);
    });
    //console.log(`about to sent data: ${prepPayload}`);
  }

  const loadBikeGeometry = async (item: string) => {
    const geomStatSerializer = new GeometryStatesSerializer();
    const knownGeometriesRaw = localStorage.getItem('knownGeometries');
    if (!knownGeometriesRaw) {
      console.error("no data in local storage - unable to load");
      return;
    }
    geomStatSerializer.deserialize(knownGeometriesRaw);
    const knownGeometries = geomStatSerializer.knownGeometries;
    if (knownGeometries == null) {
      console.error("unable to read data from local storage - unable to load");
      return;
    }
    
    const geometryData = knownGeometries.get(item);
    if (geometryData == null || geometryData.selectedFile == null || geometryData.geometryPoints == null) {
      console.error("Broken data in local storage - cannot load");
      return;
    }
    if (geometryData.selectedFile && !geometryData.selectedFileHash) {
      geometryData.selectedFileHash = await sha256(geometryData.selectedFile);
    }
    geometryData.offsetFixedRectangles = geometryData.offsetFixedRectangles || defaultOffsetFixedRectangles;
    geometryData.semiFixedRectangles = geometryData.semiFixedRectangles || defaultSemiFixedRectangles;
    geometryData.fixedRectangles = geometryData.fixedRectangles || defaultFixedRectangles;
    geometryData.fixedCircles = geometryData.fixedCircles || defaultFixedCircles;
    geometryData.handlebarGeometry = geometryData.handlebarGeometry || new OffsetSpline(15);
    geometryData.sizesTable = geometryData.sizesTable || new Map();
    geometryData.handlebarsTable = geometryData.handlebarsTable || new Map();
    geometryData.polygons = geometryData.polygons || defaultPolygons;

    for (const key of geometryData.sizesTable.keys()) {
      if (!(geometryData.sizesTable.get(key)!.seatpostExtension)) {
        geometryData.sizesTable.get(key)!.seatpostExtension = 100;
      }
      if (!(geometryData.sizesTable.get(key)!.seatSetback)) {
        geometryData.sizesTable.get(key)!.seatSetback = 0;
      }
      if (!(geometryData.sizesTable.get(key)!.seatRotation)) {
        geometryData.sizesTable.get(key)!.seatRotation = 0;
      }
      if (!geometryData.handlebarsTable.get(key)) {
        geometryData.handlebarsTable.set(key, Object.assign({}, defauleHandlebarMeasures));
      }
    }

    let {bikesList: _, ...newState} = geometryData;
    updateState(newState);

    setBikeDataName(item);
  }

  const removeBikeGeometry = (item: string) => {
    let knownGeometries: Map<string, GeometryState> = new Map();
    const knownGeometriesRaw = localStorage.getItem('knownGeometries');
    if (!knownGeometriesRaw) {
      console.error("no data in local storage - unable to load");
      return;
    }
    knownGeometries = new Map(Object.entries(JSON.parse(knownGeometriesRaw)));
    if (knownGeometries == null) {
      knownGeometries = new Map();
    }
    knownGeometries.delete(item);
    localStorage.setItem('knownGeometries', JSON.stringify(Object.fromEntries(knownGeometries)));
    updateState({ bikesList: Array.from(knownGeometries.keys()) });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="enter name to save"
        value={bikeDataName}
        onChange={(e) => setBikeDataName(e.target.value)}
      />
      <button disabled={bikeDataName == ''} onClick={() => saveGeometry()}>Save</button>
      <DropdownActions items={state.bikesList} onLoad={loadBikeGeometry} onRemove={removeBikeGeometry} />
      <p>
        <input
          type="text"
          placeholder="Make"
          value={bikeMake}
          onChange={(e) => setBikeMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          value={bikeModel}
          onChange={(e) => setBikeModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={bikeYear}
          onChange={(e) => setBikeYear(parseInt(e.target.value))}
        />
        <button disabled={bikeMake == '' || bikeModel == '' || bikeYear == 0} onClick={() => sendGeometryUpstream()}>Send to DB</button>
      </p>
    </div>
  );
};

export default GeometrySaver;
