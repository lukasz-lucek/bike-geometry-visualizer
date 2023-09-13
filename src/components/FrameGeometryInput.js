// src/components/FrameGeometryInput.js
import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';
import BikeGeometryTable from '../components/BikeGeometryTable.js';
import SizesTable from '../components/SizesTable.js';
import { useGeometryContext } from '../contexts/GeometryContext.js';
import BackgroundImage from './BackgroundImage.js';

const FrameGeometryInput = () => {
  const {
    state: [state, updateState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints) => {
    updateState({geometryPoints: {...state.geometryPoints, ...newPartialPoints}});
  }

  const { 
    state: [canvasState, ],
  } = useCanvasContext();

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();


  useEffect(() => {
    canvasState.canvas.clear();
  }, []);
  return (
    <div className="frame-input">
      <BikeGeometryTable points={state.geometryPoints} wheelbase={state.wheelbase} updatePoints={updatePoints}>
        Original geometry from image
      </BikeGeometryTable>
      <SizesTable state={state} updateState={updateState}/>

      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={true} desiredPxPerMM={1}/>}
    </div>
  );
};

export default FrameGeometryInput;
