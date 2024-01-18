import React, { useRef } from 'react';
import PointPickerControls, { PointPickerControlsRef } from '../drawing/PointPickerControls';
import Color from 'color';
import { OffsetSpline, Vec2D } from '../../interfaces/Spline';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import SplineMoveControls from '../drawing/SplineMoveControls';

const SplineGrabControls = () => {

  const pointPickerControlsRef = useRef<PointPickerControlsRef>(null);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const updateSpline = (s: OffsetSpline) => {
    updateGeometryState({handlebarGeometry: s});
  }

  const handleAddPoint = () => {
    if (!pointPickerControlsRef.current) {
      return;
    }
    const spline = new OffsetSpline(JSON.parse(JSON.stringify(geometryState.handlebarGeometry)));
    spline.reconstruct();
    const promise = pointPickerControlsRef.current.enablePointPicker(Color("blue"));
    promise.then((point) => {
      spline.addIntermediatePoint(new Vec2D(point.x ,point.y));
      updateSpline(spline)
    })
    
  }
  return (
    <div >
      <button
        onClick={() => handleAddPoint()}
      >Add point to spline</button>
      {canvasState.canvas && <PointPickerControls ref={pointPickerControlsRef} />}
      {canvasState.canvas && <SplineMoveControls spline={geometryState.handlebarGeometry} updateSpline={updateSpline} />}
    </div>
  );
};

export default SplineGrabControls;