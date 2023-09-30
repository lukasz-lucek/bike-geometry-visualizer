// src/components/ImageUploadOption.js
import React, { useState, useRef } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext'; // Import the useCanvasContext hook
import BikeGeometryTable from '../components/BikeGeometryTable.js';
import '../App.css';
import PartsGrabberSpecs from './PartsGrabberSpecs.js';
import { useGeometryContext } from '../contexts/GeometryContext';
import BackgroundImage from "../components/BackgroundImage.js"
import GeometryPointVisualization from './GeometryPointsVisualization.js';
import PointPickerControls from './PointPickerControls.js';

const ImageGeometryGrabber = () => {
  const defaultState = {
    dragOver: false,
    selectedPoint: null,
  };
  const [state, setState] = useState(defaultState);
  const updateState = (newPartialState) => {
    setState({...state,...newPartialState});
  }
  const {
    state: [canvasState, ],
  } = useCanvasContext();

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const pointPickerControlsRef = useRef(null);

  const handleAddPoint = (pointType, style, backupStyle) => {
    let button = document.querySelector(style, 'hover');
    if (button == null) {
      button = document.querySelector(backupStyle);
    }
    const computedStyle = getComputedStyle(button);
    const color = computedStyle.getPropertyValue("background-color");
    const promise = pointPickerControlsRef.current.enablePointPicker(color);
    promise.then((point) => {
      const stateChange = {
        geometryPoints: {...geometryState.geometryPoints,[pointType]: {x: point.x, y: point.y, color: color}}
      };
      updateGeometryState(stateChange);
      updateState({selectedPoint: null});
    });
    updateState({selectedPoint: pointType});

  };

  const getSuggestedRotationAngle = () => {
    const x1 = geometryState.geometryPoints['rearWheelCenter'].x;
    const y1 = geometryState.geometryPoints['rearWheelCenter'].y;
    const x2 = geometryState.geometryPoints['frontWheelCenter'].x;
    const y2 = geometryState.geometryPoints['frontWheelCenter'].y;
    
    const initialAngle = Math.atan((y1 - y2) / (x2 - x1));
    const initialAngleDegrees = initialAngle * (180 / Math.PI);
    return initialAngleDegrees;
  }

  const updatePoints = (newPartialPoints) => {
    updateGeometryState({geometryPoints: {...geometryState.geometryPoints, ...newPartialPoints}});
  }

  return (
    <div className="image-upload-option">
      <input
        type="text"
        placeholder="Wheelbase (mm)"
        value={geometryState.wheelbase}
        onChange={(e) => updateGeometryState({wheelbase: e.target.value})}
      />
      <p>
          Sugested rotation: to fix wheel level
          (
            {geometryState.geometryPoints['frontWheelCenter'] && geometryState.geometryPoints['rearWheelCenter'] ? 
              getSuggestedRotationAngle().toFixed(2) :
              '____'}
          )
        </p>
      <div className="point-buttons">
        <button
          className={state.selectedPoint === 'rearWheelCenter' ? 'selected-rear-wheel-center' : 'rear-wheel-center'}
          onClick={() => handleAddPoint('rearWheelCenter', '.rear-wheel-center', '.selected-rear-wheel-center')}
        >
          Rear Wheel Center 
          (
            {geometryState.geometryPoints['rearWheelCenter'] ? geometryState.geometryPoints['rearWheelCenter'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['rearWheelCenter'] ? geometryState.geometryPoints['rearWheelCenter'].y.toFixed(0) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'frontWheelCenter' ? 'selected-front-wheel-center' : 'front-wheel-center'}
          onClick={() => handleAddPoint('frontWheelCenter', '.front-wheel-center', '.selected-front-wheel-center')}
        >
          Front Wheel Center
          (
            {geometryState.geometryPoints['frontWheelCenter'] ? geometryState.geometryPoints['frontWheelCenter'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['frontWheelCenter'] ? geometryState.geometryPoints['frontWheelCenter'].y.toFixed(0) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'bottomBracketCenter' ? 'selected-bottom-bracket-center' : 'bottom-bracket-center'}
          onClick={() => handleAddPoint('bottomBracketCenter', '.bottom-bracket-center', '.selected-bottom-bracket-center')}
        >
          Bottom Bracket Center
          (
            {geometryState.geometryPoints['bottomBracketCenter'] ? geometryState.geometryPoints['bottomBracketCenter'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['bottomBracketCenter'] ? geometryState.geometryPoints['bottomBracketCenter'].y.toFixed(0) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'headTubeTop' ? 'selected-head-tube-top' : 'head-tube-top'}
          onClick={() => handleAddPoint('headTubeTop', '.head-tube-top', '.selected-head-tube-top')}
        >
          Head Tube Top
          (
            {geometryState.geometryPoints['headTubeTop'] ? geometryState.geometryPoints['headTubeTop'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['headTubeTop'] ? geometryState.geometryPoints['headTubeTop'].y.toFixed(0) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'headTubeBottom' ? 'selected-head-tube-bottom' : 'head-tube-bottom'}
          onClick={() => handleAddPoint('headTubeBottom', '.head-tube-bottom', '.selected-head-tube-bottom')}
        >
          Head Tube Bottom
          (
            {geometryState.geometryPoints['headTubeBottom'] ? geometryState.geometryPoints['headTubeBottom'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['headTubeBottom'] ? geometryState.geometryPoints['headTubeBottom'].y.toFixed(0) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'seatTubeTop' ? 'selected-seat-tube-top' : 'seat-tube-top'}
          onClick={() => handleAddPoint('seatTubeTop', '.seat-tube-top', '.selected-seat-tube-top')}
        >
          Seat Tube Top
          (
            {geometryState.geometryPoints['seatTubeTop'] ? geometryState.geometryPoints['seatTubeTop'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['seatTubeTop'] ? geometryState.geometryPoints['seatTubeTop'].y.toFixed(0) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'crankArmEnd' ? 'selected-crank-arm-end' : 'crank-arm-end'}
          onClick={() => handleAddPoint('crankArmEnd', '.crank-arm-end', '.selected-crank-arm-end')}
        >
          Crank Arm End
          (
            {geometryState.geometryPoints['crankArmEnd'] ? geometryState.geometryPoints['crankArmEnd'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['crankArmEnd'] ? geometryState.geometryPoints['crankArmEnd'].y.toFixed(0) : '____'}
          )
        </button>
        <button
          className={state.selectedPoint === 'handlebarMount' ? 'selected-handlebars-mount' : 'handlebars-mount'}
          onClick={() => handleAddPoint('handlebarMount', '.handlebars-mount', '.selected-handlebars-mount')}
        >
          Handlebar mount point
          (
            {geometryState.geometryPoints['handlebarMount'] ? geometryState.geometryPoints['handlebarMount'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['handlebarMount'] ? geometryState.geometryPoints['handlebarMount'].y.toFixed(0) : '____'}
          )
        </button>

        <button
          className={state.selectedPoint === 'seatMount' ? 'selected-seat-mount' : 'seat-mount'}
          onClick={() => handleAddPoint('seatMount', '.seat-mount', '.selected-seat-mount')}
        >
          Seat mount point
          (
            {geometryState.geometryPoints['seatMount'] ? geometryState.geometryPoints['seatMount'].x.toFixed(0) : '____'},
            {geometryState.geometryPoints['seatMount'] ? geometryState.geometryPoints['seatMount'].y.toFixed(0) : '____'}
          )
        </button>
        
      </div>
      <div className="bike-geometry-table">
        <BikeGeometryTable points={geometryState.geometryPoints} wheelbase={geometryState.wheelbase} updatePoints={updatePoints}>
          Bike Geometry Specifications
        </BikeGeometryTable>
        <PartsGrabberSpecs points={geometryState.geometryPoints} wheelbase={geometryState.wheelbase} updatePoints={updatePoints}/>
        {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'}/>}
        <GeometryPointVisualization pointsSet={geometryState.geometryPoints}/>
        {canvasState.canvas && <PointPickerControls ref={pointPickerControlsRef} canvas={canvasState.canvas}/>}
      </div>
    </div>
  );
};

export default ImageGeometryGrabber
;
