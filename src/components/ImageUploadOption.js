// src/components/ImageUploadOption.js
import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js'; // Import the useCanvasContext hook
import BikeGeometryTable from '../components/BikeGeometryTable.js';
import '../App.css';
import GeometrySaver from './GeometrySaver.js';
import PartsGrabberSpecs from './PartsGrabberSpecs.js';
import { useGeometryContext } from '../contexts/GeometryContext.js';

const ImageUploadOption = () => {
  const {
    state: [canvasState, ],
  } = useCanvasContext(); // Access the addLayerToCanvas method from context

  const {
    state: [state, updateState],
  } = useGeometryContext();

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
    const promise = canvasState.enablePointPickerFunc(color);
    promise.then((point) => {
      const stateChange = {
        geometryPoints: {...state.geometryPoints,[pointType]: {x: point.x, y: point.y, color: color}}, 
        selectedPoint: null
      };
      updateState(stateChange);
    });
    updateState({selectedPoint: pointType});

  };

  const getSuggestedRotationAngle = () => {
    const x1 = state.geometryPoints['rearWheelCenter'].x;
    const y1 = state.geometryPoints['rearWheelCenter'].y;
    const x2 = state.geometryPoints['frontWheelCenter'].x;
    const y2 = state.geometryPoints['frontWheelCenter'].y;
    
    const initialAngle = Math.atan((y1 - y2) / (x2 - x1));
    const initialAngleDegrees = initialAngle * (180 / Math.PI);
    return initialAngleDegrees;
  }

  const fixRoation = () => {
    canvasState.fixRotationFunc(getSuggestedRotationAngle());
  }

  const updatePoints = (newPartialPoints) => {
    updateState({geometryPoints: {...state.geometryPoints, ...newPartialPoints}});
  }

  useEffect(() => {
    //setPointSelected(() => handleCanvasClick);

    for (const [geometryPointKey, {x: x, y: y, color: color}] of Object.entries(state.geometryPoints)) {
      canvasState.addShapeVisualizationFunc(geometryPointKey, {type:"point", x: x, y: y}, color);
    }

    if (state.selectedFile != null) {
      const newLayer = {
        type: 'image',
        src: state.selectedFile,
      };
      canvasState.addLayerToCanvasFunc(newLayer); // Add the new layer to the canvas
    }

    // Clean up event listeners when the component unmounts
    return () => {
      //setPointSelected(() => null);
    };
  }, [canvasState, state.geometryPoints, state.selectedFile]);

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
        <button
          className={state.selectedPoint === 'crankArmEnd' ? 'selected-crank-arm-end' : 'crank-arm-end'}
          onClick={() => handleAddPoint('crankArmEnd', '.crank-arm-end', '.selected-crank-arm-end')}
        >
          Crank Arm End
          (
            {state.geometryPoints['crankArmEnd'] ? state.geometryPoints['crankArmEnd'].x.toFixed(1) : '____'},
            {state.geometryPoints['crankArmEnd'] ? state.geometryPoints['crankArmEnd'].y.toFixed(1) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'handlebarMount' ? 'selected-handlebars-mount' : 'handlebars-mount'}
          onClick={() => handleAddPoint('handlebarMount', '.handlebars-mount', '.selected-handlebars-mount')}
        >
          Handlebar mount point
          (
            {state.geometryPoints['handlebarMount'] ? state.geometryPoints['handlebarMount'].x.toFixed(1) : '____'},
            {state.geometryPoints['handlebarMount'] ? state.geometryPoints['handlebarMount'].y.toFixed(1) : '____'}
          )
        </button>
        <button disabled = {true}
          onClick={() => fixRoation()}>
          Sugested rotation: to fix wheel level
          (
            {state.geometryPoints['frontWheelCenter'] && state.geometryPoints['rearWheelCenter'] ? 
              getSuggestedRotationAngle().toFixed(2) :
              '____'}
          )
        </button>
      </div>
      <div className="bike-geometry-table">
        <BikeGeometryTable points={state.geometryPoints} wheelbase={state.wheelbase} updatePoints={updatePoints}>
          Bike Geometry Specifications
        </BikeGeometryTable>
        <PartsGrabberSpecs points={state.geometryPoints} wheelbase={state.wheelbase} updatePoints={updatePoints}/>
      </div>
    </div>
  );
};

export default ImageUploadOption;
