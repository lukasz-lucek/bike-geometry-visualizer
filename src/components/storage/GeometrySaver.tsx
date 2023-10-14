
import React, { useState } from 'react';
import { GeometryState, GeometryStateForSaving, useGeometryContext } from '../../contexts/GeometryContext';
import DropdownActions from './DropdownActions';

const GeometrySaver = () => {
  const [bikeDataName, setBikeDataName] = useState('');

  const {
    state: [state, updateState],
  } = useGeometryContext();

  const saveGeometry = () => {
    if (bikeDataName != '') {
      let knownGeometries : Map<string, GeometryStateForSaving> = new Map();
      const knownGeometriesRaw = localStorage.getItem('knownGeometries');
      if (knownGeometriesRaw) {
        knownGeometries = new Map(Object.entries(JSON.parse(knownGeometriesRaw)));
        if (knownGeometries == null) {
          knownGeometries = new Map();
        }
      }
      knownGeometries.set(bikeDataName,  {
        selectedFile : state.selectedFile,
        geometryPoints : state.geometryPoints,
        wheelbase: state.wheelbase,
        // workaround for inablility to save maps to local storage
        sizesTable: Object.fromEntries(state.sizesTable),
        bikesList: [],
      });
      localStorage.setItem('knownGeometries', JSON.stringify(Object.fromEntries(knownGeometries)));
      updateState({bikesList:  Array.from(knownGeometries.keys())});
    }
  }

  const loadBikeGeometry = (item : string) => {
    let knownGeometries : Map<string, GeometryState> = new Map();
    const knownGeometriesRaw = localStorage.getItem('knownGeometries');
    if (!knownGeometriesRaw) {
      console.error("no data in local storage - unable to load");
      return;
    }
    knownGeometries = new Map(Object.entries(JSON.parse(knownGeometriesRaw)));
    if (knownGeometries == null) {
      console.error("unable to read data from local storage - unable to load");
      return;
    }
    const geometryData = knownGeometries.get(item);
    if (geometryData == null || geometryData.selectedFile == null || geometryData.geometryPoints == null) {
      console.error("Broken data in local storage - cannot load");
      return;
    }
    // workaround for reading a map from local storage
    if (!(geometryData.sizesTable as any instanceof Map)) {
      console.log("trying to read old data of sizesTable");
      geometryData.sizesTable = new Map(Object.entries(geometryData.sizesTable));
    }
    updateState({
      selectedFile: geometryData.selectedFile,
      geometryPoints: geometryData.geometryPoints,
      wheelbase: geometryData.wheelbase,
      sizesTable: geometryData.sizesTable,
    });

    setBikeDataName(item);
  }

  const removeBikeGeometry = (item : string) => {
    let knownGeometries : Map<string, GeometryState> = new Map();
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
    updateState({bikesList: Array.from(knownGeometries.keys())});
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
    <DropdownActions items={state.bikesList} onLoad={loadBikeGeometry} onRemove={removeBikeGeometry}/>
  </div>
  );
};

export default GeometrySaver;
