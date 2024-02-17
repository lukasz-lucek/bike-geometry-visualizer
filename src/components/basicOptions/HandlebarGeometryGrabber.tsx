import React, { useEffect } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';
import SplineGrabControls from '../grabberControls/SplineGrabControls';
import SplineVisualization from '../drawing/SplineVisualization';
import HandlebarGeometryTable from '../bikeGeometryTable/HandlebarGeometryTable';
import { useCanvasContext } from '../../contexts/CanvasContext';
import PointMarker from '../drawing/PointMarker';
import { ColorPoint2d } from '../../interfaces/Point2d';
import Color from 'color';

const HandlebarGeometryGrabber = () => {

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const getShifterMountPoin = () : ColorPoint2d => {
    const mountPoint = geometryState.handlebarGeometry.getPointAlongSpline(geometryState.shifterMountOffset);
    return {
      color: Color('yellow'),
      x: mountPoint!.x,
      y: mountPoint!.y,
    }
  }

  return (
    <div className="image-upload-option">
      <SplineGrabControls/>
      <p>
      <label htmlFor="shifterMountPoint">Shifter mount point:</label>
      <input id="shifterMountPoint" 
        type="range" min={0} 
        max={geometryState.handlebarGeometry.getMaxOffsetAlongSpline()}
        step={0.02}
        disabled={geometryState.handlebarGeometry.getMaxOffsetAlongSpline() == 0}
        value={geometryState.shifterMountOffset}
        onChange={(e) => {updateGeometryState({shifterMountOffset: Number(e.target.value)})}}
      ></input>
      </p>
      {canvasState.canvas &&
        geometryState.handlebarGeometry && 
        geometryState.handlebarGeometry.getMaxOffsetAlongSpline() > 0 && 
        <PointMarker key={'PointMarkerShofterMountPoint'} shape={getShifterMountPoin()} />}
      <HandlebarGeometryTable>Handlebar geometry</HandlebarGeometryTable>
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={false} desiredPxPerMM={null} focusPoint={geometryState.geometryPoints.handlebarMount} />}
      <GeometryPointVisualization pointsSet={geometryState.geometryPoints} />
      
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
