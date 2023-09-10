import React, { Children, useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import { findIntermediatePoint } from '../utils/GeometryUtils';
import LineMarker from './LineMarker';

export function OffsetMarker({offset, topAnchor, bottomAnchor, pxPerMm, strokeWidth}) {

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
    if (!points[topAnchor] || !points[bottomAnchor]) {
      return;
    }
    const offsetTop = points[topAnchor];
    const offsetBottom = findIntermediatePoint(offsetTop, points[bottomAnchor], offset  * pxPerMm)

    const newShape = {
      shape : {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: offsetTop.x,
        y1: offsetTop.y,
        x2: offsetBottom.x,
        y2: offsetBottom.y,
      },
      color: 'blue'
    }
    setShape(newShape);
  }, [offset, topAnchor, bottomAnchor, geometryState.geometryPoints])

  return (
    <>
      {shape && <LineMarker shape={shape} canvas={canvasState.canvas}/>}
    </>
  );
}

export default OffsetMarker;