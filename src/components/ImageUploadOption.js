// src/components/ImageUploadOption.js
import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js'; // Import the useCanvasContext hook
import BikeGeometryTable from '../components/BikeGeometryTable.js';
import DropdownActions from '../components/DropdownActions.js';
import '../App.css';

const ImageUploadOption = () => {
  const {
    state: [contextState, ],
  } = useCanvasContext(); // Access the addLayerToCanvas method from context

  const knownGeometriesKey = 'knownGeometries'
  const defaultState = {
    dragOver: false,
    wheelbase: '',
    selectedPoint: null,
    geometryPoints: {},
    selectedFile: null,
    bikeDataName: '',
    bikesList: Object.keys(JSON.parse(localStorage.getItem(knownGeometriesKey))),
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    const newState = {...state, ...newPartialState};
    setState( newState );
  }

  const handleDrop = (e) => {
    e.preventDefault();
    updateState({dragOver: false});
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateState({selectedFile:reader.result});
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    updateState({dragOver: true});
  };

  const handleDragLeave = () => {
    updateState({dragOver: false});
  };

  const handleAddPoint = (pointType, style, backupStyle) => {
    let button = document.querySelector(style, 'hover');
    if (button == null) {
      button = document.querySelector(backupStyle);
    }
    const computedStyle = getComputedStyle(button);
    const color = computedStyle.getPropertyValue("background-color");
    const promise = contextState.enablePointPickerFunc(color);
    promise.then((point) => {
      const stateChange = {
        geometryPoints: {...state.geometryPoints,[pointType]: {x: point.x, y: point.y, color: color}}, 
        selectedPoint: null
      };
      updateState(stateChange);
    });
    updateState({selectedPoint: pointType});

  };

  const saveGeometry = () => {
    if (state.bikeDataName != '') {
      let knownGeometries = JSON.parse(localStorage.getItem('knownGeometries'));
      if (knownGeometries == null) {
        knownGeometries = {};
      }
      knownGeometries[state.bikeDataName] = {
        selectedFile : state.selectedFile,
        geometryPoints : state.geometryPoints,
        wheelbase: state.wheelbase
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
      bikeDataName: item,
      wheelbase: geometryData.wheelbase
    });
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

  useEffect(() => {
    //setPointSelected(() => handleCanvasClick);

    for (const [geometryPointKey, {x: x, y: y, color: color}] of Object.entries(state.geometryPoints)) {
      contextState.addShapeVisualizationFunc(geometryPointKey, {type:"point", x: x, y: y}, color);
    }

    if (state.selectedFile != null) {
      const newLayer = {
        type: 'image',
        src: state.selectedFile,
      };
      contextState.addLayerToCanvasFunc(newLayer); // Add the new layer to the canvas
    }

    // Clean up event listeners when the component unmounts
    return () => {
      //setPointSelected(() => null);
    };
  }, [contextState, state.geometryPoints, state.selectedFile]);

  return (
    <div className="image-upload-option" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      {state.dragOver ? 
        <div className="drop-indicator">Drop it - I'm ready</div> : 
        <div className="drop-indicator">You can drop images here</div>}
      <input type="file" onChange={handleFileInputChange} />
      <input
        type="text"
        placeholder="Wheelbase (mm)"
        value={state.wheelbase}
        onChange={(e) => updateState({wheelbase: e.target.value})}
      />
      <div className="point-buttons">
        <button
          className={state.selectedPoint === 'rearWheelCenter' ? 'selected-rear-wheel-center' : 'rear-wheel-center'}
          onClick={() => handleAddPoint('rearWheelCenter', '.rear-wheel-center', '.selected-rear-wheel-center')}
        >
          Rear Wheel Center 
          (
            {state.geometryPoints['rearWheelCenter'] ? state.geometryPoints['rearWheelCenter'].x.toFixed(1) : '____'},
            {state.geometryPoints['rearWheelCenter'] ? state.geometryPoints['rearWheelCenter'].y.toFixed(1) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'frontWheelCenter' ? 'selected-front-wheel-center' : 'front-wheel-center'}
          onClick={() => handleAddPoint('frontWheelCenter', '.front-wheel-center', '.selected-front-wheel-center')}
        >
          Front Wheel Center
          (
            {state.geometryPoints['frontWheelCenter'] ? state.geometryPoints['frontWheelCenter'].x.toFixed(1) : '____'},
            {state.geometryPoints['frontWheelCenter'] ? state.geometryPoints['frontWheelCenter'].y.toFixed(1) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'bottomBracketCenter' ? 'selected-bottom-bracket-center' : 'bottom-bracket-center'}
          onClick={() => handleAddPoint('bottomBracketCenter', '.bottom-bracket-center', '.selected-bottom-bracket-center')}
        >
          Bottom Bracket Center
          (
            {state.geometryPoints['bottomBracketCenter'] ? state.geometryPoints['bottomBracketCenter'].x.toFixed(1) : '____'},
            {state.geometryPoints['bottomBracketCenter'] ? state.geometryPoints['bottomBracketCenter'].y.toFixed(1) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'headTubeTop' ? 'selected-head-tube-top' : 'head-tube-top'}
          onClick={() => handleAddPoint('headTubeTop', '.head-tube-top', '.selected-head-tube-top')}
        >
          Head Tube Top
          (
            {state.geometryPoints['headTubeTop'] ? state.geometryPoints['headTubeTop'].x.toFixed(1) : '____'},
            {state.geometryPoints['headTubeTop'] ? state.geometryPoints['headTubeTop'].y.toFixed(1) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'headTubeBottom' ? 'selected-head-tube-bottom' : 'head-tube-bottom'}
          onClick={() => handleAddPoint('headTubeBottom', '.head-tube-bottom', '.selected-head-tube-bottom')}
        >
          Head Tube Bottom
          (
            {state.geometryPoints['headTubeBottom'] ? state.geometryPoints['headTubeBottom'].x.toFixed(1) : '____'},
            {state.geometryPoints['headTubeBottom'] ? state.geometryPoints['headTubeBottom'].y.toFixed(1) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'seatTubeTop' ? 'selected-seat-tube-top' : 'seat-tube-top'}
          onClick={() => handleAddPoint('seatTubeTop', '.seat-tube-top', '.selected-seat-tube-top')}
        >
          Seat Tube Top
          (
            {state.geometryPoints['seatTubeTop'] ? state.geometryPoints['seatTubeTop'].x.toFixed(1) : '____'},
            {state.geometryPoints['seatTubeTop'] ? state.geometryPoints['seatTubeTop'].y.toFixed(1) : '____'}
          )
        </button>
      </div>
      <BikeGeometryTable points={state.geometryPoints} wheelbase={state.wheelbase}/>
      <input
        type="text"
        placeholder="enter name to save"
        value={state.bikeDataName}
        onChange={(e) => updateState({bikeDataName: e.target.value})}
      />
      <button disabled={state.bikeDataName == ''} onClick={() => saveGeometry()}>Save</button>
      <DropdownActions items={state.bikesList} onLoad={loadBikeGeometry} onRemove={removeBikeGeometry}/>
    </div>
  );
};

export default ImageUploadOption;
