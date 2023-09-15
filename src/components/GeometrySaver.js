// src/components/DropdownActions.js
import React, { useState } from 'react';
import { useGeometryContext } from '../contexts/GeometryContext';
import DropdownActions from './DropdownActions';

const GeometrySaver = () => {
  const [bikeDataName, setBikeDataName] = useState('');

  const {
    state: [state, updateState],
  } = useGeometryContext();

  const saveGeometry = () => {
    if (bikeDataName != '') {
      let knownGeometries = JSON.parse(localStorage.getItem('knownGeometries'));
      if (knownGeometries == null) {
        knownGeometries = {};
      }
      knownGeometries[bikeDataName] = {
        selectedFile : state.selectedFile,
        geometryPoints : state.geometryPoints,
        wheelbase: state.wheelbase,
        sizesTable: state.sizesTable,
      };
      localStorage.setItem('knownGeometries', JSON.stringify(knownGeometries));
      updateState({bikesList: Object.keys(knownGeometries)});
    }
  }

  const loadBikeGeometry = (item) => {
    let knownGeometries = JSON.parse(localStorage.getItem('knownGeometries'));
    if (knownGeometries == null) {
      console.error("no data in local storage - unable to load");
      return;
    }
    const geometryData = knownGeometries[item];
    if (geometryData == null || geometryData.selectedFile == null || geometryData.geometryPoints == null) {
      console.error("Broken data in local storage - cannot load");
      return;
    }
    updateState({
      selectedFile: geometryData.selectedFile,
      geometryPoints: geometryData.geometryPoints,
      wheelbase: geometryData.wheelbase,
      sizesTable: geometryData.sizesTable,
    });

    setBikeDataName(item);
  }

  const removeBikeGeometry = (item) => {
    let knownGeometries = JSON.parse(localStorage.getItem('knownGeometries'));
    if (knownGeometries == null) {
      knownGeometries = {};
    }
    delete knownGeometries[item];
    localStorage.setItem('knownGeometries', JSON.stringify(knownGeometries));
    updateState({bikesList: Object.keys(knownGeometries)});
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
