// src/components/FrameGeometryInput.js
import React, { useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import SizesTable from '../components/SizesTable.js';
import { useGeometryContext } from '../contexts/GeometryContext';
import BackgroundImage from './drawing/BackgroundImage';

const FrameGeometryInput = () => {
  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints) => {
    updateGeometryState({geometryPoints: {...geometryState.geometryPoints, ...newPartialPoints}});
  }

  const { 
    state: [canvasState, ],
  } = useCanvasContext();

  const [showShadowImage, setShowShadowImage] = useState(true);

  return (
    <div className="frame-input">
      <SizesTable state={geometryState} updateState={updateGeometryState}/>
      <p><input type="checkbox" checked={showShadowImage} onChange={() => {setShowShadowImage(!showShadowImage);}}/><label>Show Shadow Image</label></p>

      {geometryState.selectedFile && showShadowImage && <BackgroundImage key={'BackgroundImage'} isGrayedOut={true} desiredPxPerMM={1}/>}
    </div>
  );
};

export default FrameGeometryInput;
