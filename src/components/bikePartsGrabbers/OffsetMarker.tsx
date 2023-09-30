import Color from 'color';
import React, { useEffect, useState } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { findIntermediatePoint } from '../../utils/GeometryUtils';
import LineMarker, { Line } from '../drawing/LineMarker';

export interface TableAngleRowPropsType {
  offset: number,
  topAnchor: string,
  bottomAnchor: string,
  pxPerMm: number,
  strokeWidth: number,
}

export function OffsetMarker({offset, topAnchor, bottomAnchor, pxPerMm, strokeWidth} : TableAngleRowPropsType) {

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  const [shape, setShape] = useState<Line | null>(null);

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points) {
      return;
    }
    const ta = points.get(topAnchor);
    let ba = points.get(bottomAnchor);

    if (!ta || !ba) {
      return;
    }
    if (ta.x == ba.x && ta.y == ba.y) {
      //force vertical offset
      ba.y-=10;
    }
    const offsetBottom = findIntermediatePoint(ta, ba, offset  * pxPerMm)

    if (!offsetBottom) {
      return;
    }

    const newShape : Line = {
      strokeWidth: strokeWidth,
      p1: ta,
      p2: offsetBottom,
      color: Color('blue')
    }
    setShape(newShape);
  }, [offset, topAnchor, bottomAnchor, geometryState.geometryPoints])

  return (
    <>
      {shape && <LineMarker line={shape}/>}
    </>
  );
}

export default OffsetMarker;