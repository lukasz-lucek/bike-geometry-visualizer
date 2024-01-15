
import React, { useState } from 'react';
import { defaultFixedCircles, defaultFixedRectangles, defaultOffsetFixedRectangles, defaultSemiFixedRectangles, GeometryState, useGeometryContext } from '../../contexts/GeometryContext';
import DropdownActions from './DropdownActions';
import GeometryStatesSerializer from '../../contexts/GeometryStatesSerilizer';

const GeometrySaver = () => {
  const [bikeDataName, setBikeDataName] = useState('');

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

  const loadBikeGeometry = (item: string) => {
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
    geometryData.offsetFixedRectangles = geometryData.offsetFixedRectangles || defaultOffsetFixedRectangles;
    geometryData.semiFixedRectangles = geometryData.semiFixedRectangles || defaultSemiFixedRectangles;
    geometryData.fixedRectangles = geometryData.fixedRectangles || defaultFixedRectangles;
    geometryData.fixedCircles = geometryData.fixedCircles || defaultFixedCircles;
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
    </div>
  );
};

export default GeometrySaver;
