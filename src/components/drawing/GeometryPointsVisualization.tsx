import React, { useState, useEffect } from 'react';
import { GeometryPoints } from '../../contexts/GeometryContext';
import { ColorPoint2d } from '../../interfaces/Point2d';
import PointMarker from './PointMarker';
// import { useCanvasContext } from '../../contexts/CanvasContext';
// import { OffsetSpline, Vec2D } from '../../interfaces/Spline';

export function GeometryPointVisualization({ pointsSet }: { pointsSet: GeometryPoints }) {

  const [shapes, setShapes] = useState<Map<string, ColorPoint2d>>(new Map());
  // const {
  //   state: [canvasState,],
  // } = useCanvasContext();

  useEffect(() => {
    let allShapes: Map<string, ColorPoint2d> = new Map();
    const entries = Object.entries(pointsSet);
    const pointsToShow = Object.entries(pointsSet).filter(([_, entry]) => { return entry && entry.x && entry.y });
    for (const [geometryPointKey, { x: x, y: y, color: color }] of pointsToShow) {
      allShapes.set(geometryPointKey, { x: x, y: y, color: color });
    }
    setShapes(allShapes);

    // const canvas = canvasState.canvas;
    // if (canvas) {
    //   const spline = new OffsetSpline(15);
    //   allShapes.forEach((value,) => {spline.addIntermediatePoint(new Vec2D(value.x ,value.y))});
    //   spline.drawToCanvas(canvas,false);
    //   return () => {
    //     // segment.removeFromCanvas(canvas);
    //     spline.removeFromCanvas(canvas);
    //   }
    // }
  }, [pointsSet]);

  return (
    <>
      {[...shapes].map(([key, value], index) =>
        <PointMarker key={'PointMarker' + key} shape={value} />
      )}
    </>
  );
}

export default GeometryPointVisualization;