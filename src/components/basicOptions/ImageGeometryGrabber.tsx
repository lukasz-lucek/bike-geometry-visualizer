import React, { useState, useRef } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext'; // Import the useCanvasContext hook
import BikeGeometryTable from '../bikeGeometryTable/BikeGeometryTable';
import PartsGrabberTable from '../grabberControls/PartsGrabberTable';
import PointGrabGrid from '../grabberControls/PointGrabGrid';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';

const ImageGeometryGrabber = () => {

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();


  const getSuggestedRotationAngle = () : number => {
    const rearWheelCenter = geometryState.geometryPoints.rearWheelCenter;
    const frontWheelCenter = geometryState.geometryPoints.frontWheelCenter;
    if (!rearWheelCenter || !frontWheelCenter) {
      return 0;
    }
    const x1 = rearWheelCenter.x;
    const y1 = rearWheelCenter.y;
    const x2 = frontWheelCenter.x;
    const y2 = frontWheelCenter.y;
    
    const initialAngle = Math.atan((y1 - y2) / (x2 - x1));
    const initialAngleDegrees = initialAngle * (180 / Math.PI);
    return initialAngleDegrees;
  }

  return (
    <div className="image-upload-option">
      <input
        type="number"
        placeholder="Wheelbase (mm)"
        value={geometryState.wheelbase?geometryState.wheelbase:0}
        onChange={(e) => updateGeometryState({wheelbase: parseInt( e.target.value )})}
      />
      <p>
          Sugested rotation: to fix wheel level
          (
            {geometryState.geometryPoints['frontWheelCenter'] && geometryState.geometryPoints['rearWheelCenter'] ? 
              getSuggestedRotationAngle().toFixed(2) :
              '____'}
          )
      </p>
      <PointGrabGrid></PointGrabGrid>
      <div className="bike-geometry-table">
        <BikeGeometryTable>
          Bike Geometry Specifications
        </BikeGeometryTable>
        <PartsGrabberTable/>
        {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={false} desiredPxPerMM={null}/>}
        <GeometryPointVisualization pointsSet={geometryState.geometryPoints}/>
      </div>
    </div>
  );
};

export default ImageGeometryGrabber
;
