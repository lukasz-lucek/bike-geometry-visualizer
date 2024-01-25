import React, { useEffect } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';
import SplineGrabControls from '../grabberControls/SplineGrabControls';
import SplineVisualization from '../drawing/SplineVisualization';
import HandlebarGrabber from '../grabbers/HandlebarGrabber';
import HandlebarGeometryTable from '../bikeGeometryTable/HandlebarGeometryTable';

const HandlebarGeometryGrabber = () => {

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  return (
    <div className="image-upload-option">
      <SplineGrabControls/>
      <HandlebarGeometryTable>Handlebar geometry</HandlebarGeometryTable>
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={false} desiredPxPerMM={null} focusPoint={geometryState.geometryPoints.handlebarMount} />}
      <GeometryPointVisualization pointsSet={geometryState.geometryPoints} />
      <SplineVisualization spline={geometryState.handlebarGeometry} drawControlPoints={true}/>
{/* 
      {geometryState.handlebarGeometry && 
            <HandlebarGrabber
              geometry={geometryState.handlebarGeometry}
              raise={0}
              setback={0}
              reach={0}
              drop={0}
              rotation={0}
              pxPerMm={1}
              mountingPoint={null}
              desiredPxPerMM={1}
              layer={7} />
          } */}
    </div>
  );
};

export default HandlebarGeometryGrabber
  ;
