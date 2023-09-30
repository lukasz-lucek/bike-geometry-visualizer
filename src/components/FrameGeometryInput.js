// src/components/FrameGeometryInput.js
import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import BikeGeometryTable from '../components/BikeGeometryTable.js';
import SizesTable from '../components/SizesTable.js';
import { useGeometryContext } from '../contexts/GeometryContext.js';
import BackgroundImage from './BackgroundImage.js';

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
      {/* <BikeGeometryTable points={geometryState.geometryPoints} wheelbase={geometryState.wheelbase} updatePoints={updatePoints}>
        Original geometry from image
      </BikeGeometryTable> */}
      <SizesTable state={geometryState} updateState={updateGeometryState}/>
      <p><input type="checkbox" checked={showShadowImage} onChange={() => {setShowShadowImage(!showShadowImage);}}/><label>Show Shadow Image</label></p>

      {geometryState.selectedFile && showShadowImage && <BackgroundImage key={'BackgroundImage'} isGrayedOut={true} desiredPxPerMM={1}/>}
    </div>
  );
};

export default FrameGeometryInput;
