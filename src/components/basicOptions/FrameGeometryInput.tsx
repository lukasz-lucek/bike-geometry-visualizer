// src/components/FrameGeometryInput.js
import React, { useState } from 'react';
import SizesTable from '../sizesTable/SizesTable';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from '../drawing/BackgroundImage';

const FrameGeometryInput = () => {
  const {
    state: [geometryState, ],
  } = useGeometryContext();

  const [showShadowImage, setShowShadowImage] = useState(true);

  return (
    <div className="frame-input">
      <SizesTable/>
      <p><input type="checkbox" checked={showShadowImage} onChange={() => {setShowShadowImage(!showShadowImage);}}/><label>Show Shadow Image</label></p>

      {geometryState.selectedFile && showShadowImage && <BackgroundImage key={'BackgroundImage'} isGrayedOut={true} desiredPxPerMM={1}/>}
    </div>
  );
};

export default FrameGeometryInput;
