import React, { useRef } from 'react';
import PointPickerControls, { PointPickerControlsRef } from '../drawing/PointPickerControls';
import Color from 'color';
import { OffsetSpline, Vec2D } from '../../interfaces/Spline';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import SplineMoveControls from '../drawing/SplineMoveControls';
import PointMarker from '../drawing/PointMarker';
import { ColorPoint2d } from '../../interfaces/Point2d';

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

  const getShifterMountPoin = () : ColorPoint2d => {
    const mountPoint = geometryState.handlebarGeometry.getPointAlongSpline(geometryState.shifterMountOffset);
    return {
      color: Color('yellow'),
      x: mountPoint!.x,
      y: mountPoint!.y,
    }
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
      <label htmlFor="shifterMountPoint">Shifter mount point:</label>
      <input id="shifterMountPoint" 
        type="range" min={0} 
        max={geometryState.handlebarGeometry.getMaxOffsetAlongSpline()}
        step={0.02}
        disabled={geometryState.handlebarGeometry.getMaxOffsetAlongSpline() == 0}
        value={geometryState.shifterMountOffset}
        onChange={(e) => {updateGeometryState({shifterMountOffset: Number(e.target.value)})}}
      ></input>
      {canvasState.canvas && <SplineMoveControls spline={geometryState.handlebarGeometry} updateSpline={updateSpline} />}
      {canvasState.canvas &&
        geometryState.handlebarGeometry && 
        geometryState.handlebarGeometry.getMaxOffsetAlongSpline() > 0 && 
        <PointMarker key={'PointMarkerShofterMountPoint'} shape={getShifterMountPoin()} />}
      
    </div>
  );
};

export default SplineGrabControls;