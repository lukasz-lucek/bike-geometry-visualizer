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
    const ta = points[topAnchor];
    let ba = points[bottomAnchor];

    if (!ta || !ba) {
      return;
    }
    if (ta.x == ba.x && ta.y == ba.y) {
      //force vertical offset
      ba.y-=10;
    }
    const offsetBottom = findIntermediatePoint(ta, ba, offset  * pxPerMm)

    const newShape = {
      shape : {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: ta.x,
        y1: ta.y,
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