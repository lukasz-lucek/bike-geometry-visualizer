import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import { findIntermediatePoint } from '../utils/GeometryUtils';
import RectangleMarker from './RectangleMarker';

export function RectanglePartGrabber(
  {leftOffset,
    rightOffset,
    width,
    anchorPoints,
    pxPerMm,
    strokeWidth,
    leftPlacementPoint=null,
    rightPlacementPoint=null,
    layer=3}) {

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
    if (!points[anchorPoints.tl] || !points[anchorPoints.bl] || !points[anchorPoints.tr] || !points[anchorPoints.br]) {
      return;
    }
    const leftOffsetPoint = findIntermediatePoint(points[anchorPoints.tl], points[anchorPoints.bl], leftOffset  * pxPerMm);
    const rightOffsetPoint = findIntermediatePoint(points[anchorPoints.tr], points[anchorPoints.br], rightOffset  * pxPerMm);

    const newShape = {
      shape : {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: leftOffsetPoint.x,
        y1: leftOffsetPoint.y,
        x2: rightOffsetPoint.x,
        y2: rightOffsetPoint.y,
        width: width * pxPerMm,
      },
      color: 'blue'
    }
    setShape(newShape);
  }, [leftOffset, rightOffset, width, anchorPoints, pxPerMm, strokeWidth, geometryState.geometryPoints])


  return (
    <>
      {shape &&
      <RectangleMarker
        shape={shape}
        canvas={canvasState.canvas}
        leftPlacementPoint={leftPlacementPoint}
        rightPlacementPoint={rightPlacementPoint}
        layer={layer}
      />}
    </>
  );
}

export default RectanglePartGrabber;