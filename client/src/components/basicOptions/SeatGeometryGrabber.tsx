import React from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';
import { useCanvasContext } from '../../contexts/CanvasContext';
import PolygonGrabControls from '../grabberControls/PolygonGrabControls';
import { Polygon } from '../../interfaces/Polygon';
import LineMarker, { Line } from '../drawing/LineMarker';
import Color from 'color';
import { findPointFromPointAngleLength } from '../../utils/GeometryUtils';

const SeatGeometryGrabber = () => {

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const getSeatRailAngleLine = () : Line => {
    const startPoint = findPointFromPointAngleLength(geometryState.geometryPoints.seatMount!, geometryState.seatRailAngle, 50);
    const endPoint = findPointFromPointAngleLength(geometryState.geometryPoints.seatMount!, geometryState.seatRailAngle+180, 50);
    return {
      color: Color('yellow'),
      strokeWidth: 1,
      p1: startPoint,
      p2: endPoint,
    }
  }
  const updateShifterPolygon = (polygon: Polygon) => {
    updateGeometryState({polygons: {shifter: geometryState.polygons.shifter, seat: polygon}});
  }

  return (
    <div className="image-upload-option">
      <PolygonGrabControls polygon={geometryState.polygons.seat} updatePolygon={updateShifterPolygon}/>
      <p>
      <label htmlFor="seatRailAngle">Seat rail angle:</label>
      <input id="seatRailAngle" 
        type="range" min={-20} 
        max={20}
        step={0.2}
        disabled={!geometryState.geometryPoints.seatMount}
        value={geometryState.seatRailAngle}
        onChange={(e) => {updateGeometryState({seatRailAngle: Number(e.target.value)})}}
      ></input>
      </p>
      {canvasState.canvas &&
        geometryState.geometryPoints.seatMount && 
        <LineMarker key={'LineMarkerSeatRailAngle'} line={getSeatRailAngleLine()} />}
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={false} desiredPxPerMM={null} focusPoint={geometryState.geometryPoints.seatMount} />}
      <GeometryPointVisualization pointsSet={geometryState.geometryPoints} />
    </div>
  );
};

export default SeatGeometryGrabber
  ;
