import React, { useState, useEffect } from 'react';
import { GeometryPoints } from '../../contexts/GeometryContext';
import { ColorPoint2d } from '../../interfaces/Point2d';
import PointMarker from './PointMarker';
// import { useCanvasContext } from '../../contexts/CanvasContext';
// import { OffsetSpline, SplineDragIndex, SplineDragIndexType, Vec2D } from '../../interfaces/Spline';

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
    // if (canvas && allShapes.size > 0) {
    //   const spline = new OffsetSpline(15);
    //   allShapes.forEach((value,) => {spline.addIntermediatePoint(new Vec2D(value.x ,value.y))});
    //   spline.drawToCanvas(canvas,true);


    //   const minimalRepresentation = JSON.stringify(spline);
    //   console.log(minimalRepresentation);
    //   const spline2 = new OffsetSpline(minimalRepresentation);
    //   spline2.reconstruct();
    //   spline2.drawToCanvas(canvas, true);

    //   if (allShapes.size > 0) {
    //     spline.moveDragToPosition(new SplineDragIndex(SplineDragIndexType.INTERMEDIATE, 0, new Vec2D(0, 0)), new Vec2D(450, 700));
    //     spline.moveDragToPosition(new SplineDragIndex(SplineDragIndexType.CONTROL, 0, new Vec2D(0, 0)), new Vec2D(650, 450));
    //   }
    //   if (allShapes.size > 1) {
    //     spline.moveDragToPosition(new SplineDragIndex(SplineDragIndexType.INTERMEDIATE, 1, new Vec2D(0, 0)), new Vec2D(1450, 750));
    //     spline.moveDragToPosition(new SplineDragIndex(SplineDragIndexType.CONTROL, 1, new Vec2D(0, 0)), new Vec2D(1950, 950));
    //   }
    //   spline.drawToCanvas(canvas,false);

    //   return () => {
    //     spline.removeFromCanvas(canvas);
    //     spline2.removeFromCanvas(canvas);
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