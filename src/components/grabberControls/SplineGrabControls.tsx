import React, { useRef, useState } from 'react';
import PointPickerControls, { PointPickerControlsRef } from '../drawing/PointPickerControls';
import Color from 'color';
import { OffsetSpline, Vec2D } from '../../interfaces/Spline';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import SplineMoveControls from '../drawing/SplineMoveControls';
import SplineVisualization from '../drawing/SplineVisualization';

const SplineGrabControls = () => {

  const pointPickerControlsRef = useRef<PointPickerControlsRef>(null);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const [showGeometry, setShowGeometry] = useState(true);
  const [showControlPoints, setShowControlPoints] = useState(false);


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

  const handleRemovePoint = () => {
    const spline = new OffsetSpline(JSON.parse(JSON.stringify(geometryState.handlebarGeometry)));
    spline.reconstruct();
    spline.removeLastIntermediatePoint();
    updateSpline(spline)
  }

  const setThickness = (val: number) => {
    const spline = new OffsetSpline(JSON.parse(JSON.stringify(geometryState.handlebarGeometry)));
    spline.reconstruct();
    spline.setThickness(val);
    updateSpline(spline);
  }

  return (
    <div >
      <button
        onClick={() => handleAddPoint()}
      >Append point</button>
      {canvasState.canvas && <PointPickerControls ref={pointPickerControlsRef} />}
      <label htmlFor="handlebarThickenss">Thickenss: </label>
      <input
        id='handlebarThickenss'
        value={geometryState.handlebarGeometry.getThickness().toFixed(0)}
        onChange={(e) => setThickness(Number(e.target.value))}
        type="number"/>
      <button
        onClick={() => handleRemovePoint()}
      >Remove last point</button>
      <br/>
      <label htmlFor='showGeometryCheckbox'>Show geometry:</label>
      <input id='showGeometryCheckbox' type="checkbox" onChange={(e) => {setShowGeometry(e.target.checked)}} checked={showGeometry}/>
      <label htmlFor='showControlPointsCheckbox'>Show geometry helper lines:</label>
      <input id='showControlPointsCheckbox' type="checkbox" disabled={!showGeometry} onChange={(e) => {setShowControlPoints(e.target.checked)}} checked={showControlPoints}/>
      {canvasState.canvas && <SplineMoveControls spline={geometryState.handlebarGeometry} updateSpline={updateSpline} />}
      {showGeometry && <SplineVisualization spline={geometryState.handlebarGeometry} drawControlPoints={showControlPoints}/>}
    </div>
  );
};

export default SplineGrabControls;