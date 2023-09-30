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
    layer=3,
    overridePoints=null,
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
    let leftOffsetPoint = null;
    let rightOffsetPoint = null;
    if (!overridePoints) {
      if (!points[anchorPoints.tl] || !points[anchorPoints.bl] || !points[anchorPoints.tr] || !points[anchorPoints.br]) {
        return;
      }
      if (anchorPoints.tl == anchorPoints.bl) {
        const ba = {
          x:points[anchorPoints.bl].x,
          y:points[anchorPoints.bl].y-10
        };
        leftOffsetPoint = findIntermediatePoint(points[anchorPoints.tl], ba, leftOffset  * pxPerMm);
      } else {
        leftOffsetPoint = findIntermediatePoint(points[anchorPoints.tl], points[anchorPoints.bl], leftOffset  * pxPerMm);
      }
      if (anchorPoints.tr == anchorPoints.br) {
        const ba = {
          x:points[anchorPoints.br].x,
          y:points[anchorPoints.br].y-10
        };
        rightOffsetPoint = findIntermediatePoint(points[anchorPoints.tr], ba, leftOffset  * pxPerMm);
      } else {
        rightOffsetPoint = findIntermediatePoint(points[anchorPoints.tr], points[anchorPoints.br], rightOffset  * pxPerMm);
      }
    } else {
      leftOffsetPoint = overridePoints.leftOffsetPoint;
      rightOffsetPoint = overridePoints.rightOffsetPoint;
    }
    if (!leftOffsetPoint || !rightOffsetPoint) {
      return;
    }

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
  }, [leftOffset, rightOffset, width, anchorPoints, pxPerMm, strokeWidth, geometryState.geometryPoints, overridePoints])


  return (
    <>
      {shape &&
      <RectangleMarker
        shape={shape}
        canvas={canvasState.canvas}
        leftPlacementPoint={leftPlacementPoint}
        rightPlacementPoint={rightPlacementPoint}
        layer={layer}
        scaling={desiredPxPerMM?desiredPxPerMM/pxPerMm:1}
      />}
    </>
  );
}

export default RectanglePartGrabber;