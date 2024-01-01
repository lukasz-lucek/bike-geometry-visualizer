import React from 'react';
import BikeGeometryTable from '../bikeGeometryTable/BikeGeometryTable';
import PartsGrabberTable from '../grabberControls/PartsGrabberTable';
import PointGrabGrid from '../grabberControls/PointGrabGrid';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';

const HandlebarGeometryGrabber = () => {

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  return (
    <div className="image-upload-option">
      {/* <PointGrabGrid></PointGrabGrid> */}
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
