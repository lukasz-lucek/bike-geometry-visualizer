import Color from 'color';
import React, { useEffect, useState } from 'react';
import { equalPoints, Point2d } from '../../interfaces/Point2d';
import { findIntermediatePoint } from '../../utils/GeometryUtils';
import LineMarker, { Line } from '../drawing/LineMarker';

export interface TableAngleRowPropsType {
  offset: number,
  topAnchor: Point2d,
  bottomAnchor: Point2d,
  pxPerMm: number,
  strokeWidth: number,
}

export function OffsetGrabber({offset, topAnchor, bottomAnchor, pxPerMm, strokeWidth} : TableAngleRowPropsType) {

  const [shape, setShape] = useState<Line | null>(null);

  useEffect(() => {
    if (!topAnchor || !bottomAnchor) {
      return;
    }

    let ba : Point2d = bottomAnchor;
    if (equalPoints(topAnchor, bottomAnchor)) {
      //force vertical offset
      ba = {
        x: bottomAnchor.x,
        y: bottomAnchor.y - 10,
      }
    }
    const offsetBottom = findIntermediatePoint(topAnchor, ba, offset  * pxPerMm)

    if (!offsetBottom) {
      return;
    }

    const newShape : Line = {
      strokeWidth: strokeWidth,
      p1: topAnchor,
      p2: offsetBottom,
      color: Color('blue')
    }
    setShape(newShape);
  }, [offset, topAnchor, bottomAnchor])

  return (
    <>
      {shape && <LineMarker line={shape}/>}
    </>
  );
}

export default OffsetGrabber;