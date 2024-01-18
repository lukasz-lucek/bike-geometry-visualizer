import React, { useEffect } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';
import SplineGrabControls from '../grabberControls/SplineGrabControls';
import SplineVisualization from '../drawing/SplineVisualization';

const HandlebarGeometryGrabber = () => {

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  return (
    <div className="image-upload-option">
      <SplineGrabControls/>
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={false} desiredPxPerMM={null} focusPoint={geometryState.geometryPoints.handlebarMount} />}
      <GeometryPointVisualization pointsSet={geometryState.geometryPoints} />
      <SplineVisualization spline={geometryState.handlebarGeometry} drawControlPoints={true}/>
    </div>
  );
};

export default HandlebarGeometryGrabber
  ;
