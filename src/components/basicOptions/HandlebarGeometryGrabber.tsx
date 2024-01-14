import React from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';
import SplineGrabControls from '../grabberControls/SplineGrabControls';

const HandlebarGeometryGrabber = () => {

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  return (
    <div className="image-upload-option">
      <SplineGrabControls/>
      <div className="bike-geometry-table">
        {/* <BikeGeometryTable>
          Bike Geometry Specifications
        </BikeGeometryTable>
        <PartsGrabberTable /> */}
        {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={false} desiredPxPerMM={null} focusPoint={geometryState.geometryPoints.handlebarMount} />}
        <GeometryPointVisualization pointsSet={geometryState.geometryPoints} />
      </div>
    </div>
  );
};

export default HandlebarGeometryGrabber
  ;
