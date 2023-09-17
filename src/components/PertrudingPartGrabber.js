import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import { findIntermediatePoint } from '../utils/GeometryUtils';
import RectangleMarker from './RectangleMarker';

export function PertrudingPartGrabber({
  width,
  length,
  anchorPoints,
  pxPerMm,
  strokeWidth,
  leftPlacementPoint=null,
  rightPlacementPoint=null,
  layer=3,
  desiredPxPerMM=null,
}) {

  const {
    state: [canvasState, ],
  } = useCanvasContext(); 

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  const [shape, setShape] = useState(null);

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points) {
      return;
    }
    if (!points[anchorPoints.tl] || !points[anchorPoints.bl]) {
      return;
    }
    const topPoint = points[anchorPoints.tl];
    const endPoint = findIntermediatePoint(points[anchorPoints.tl], points[anchorPoints.bl], -length  * pxPerMm);

    const newShape = {
      shape : {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: topPoint.x,
        y1: topPoint.y,
        x2: endPoint.x,
        y2: endPoint.y,
        width: width * pxPerMm,
      },
      color: 'blue'
    }
    setShape(newShape);
  }, [width, length, anchorPoints, pxPerMm, strokeWidth, geometryState.geometryPoints])


  return (
    <>
      {shape && <RectangleMarker
        shape={shape}
        canvas={canvasState.canvas}
        leftPlacementPoint={leftPlacementPoint}
        rightPlacementPoint={rightPlacementPoint}
        layer={layer}
        scaling={desiredPxPerMM?desiredPxPerMM/pxPerMm:1}/>}
    </>
  );
}

export default PertrudingPartGrabber;