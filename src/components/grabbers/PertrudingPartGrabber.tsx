import Color from 'color';
import React, { useEffect, useState } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { Point2d } from '../../interfaces/Point2d';
import { findIntermediatePoint } from '../../utils/GeometryUtils';
import RectangleMarker, { RectangleMarkerData } from '../drawing/RectangleMarker';

interface PertrudingPartGrabberProps {
  width : number
  length : number
  anchorPoints : {
    tl: Point2d | null;
    bl: Point2d | null;
  }
  pxPerMm : number,
  strokeWidth : number,
  leftPlacementPoint? : Point2d | null,
  rightPlacementPoint? : Point2d | null,
  layer? : number,
  desiredPxPerMM?: number | null,
}

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
} : PertrudingPartGrabberProps) {

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  const [rectangleMarkerData, setRectangleMarkerData] = useState<RectangleMarkerData | null>(null);

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points) {
      return;
    }
    if (!anchorPoints.tl || !anchorPoints.bl) {
      return;
    }
    const endPoint = findIntermediatePoint(anchorPoints.tl, anchorPoints.bl, -length  * pxPerMm);
    if (!endPoint) {
      return;
    }

    const newRectangleMarkerData : RectangleMarkerData = {
      rectangle: {
        p1: anchorPoints.tl,
        p2: endPoint,
        width: width * pxPerMm
      },
      color: Color('blue'),
      strokeWidth: strokeWidth,
    }
    setRectangleMarkerData(newRectangleMarkerData);
  }, [width, length, anchorPoints, pxPerMm, strokeWidth, geometryState.geometryPoints])


  return (
    <>
      {rectangleMarkerData && <RectangleMarker
        rectangleMarker={rectangleMarkerData}
        leftPlacementPoint={leftPlacementPoint}
        rightPlacementPoint={rightPlacementPoint}
        layer={layer}
        scaling={desiredPxPerMM?desiredPxPerMM/pxPerMm:1}/>}
    </>
  );
}

export default PertrudingPartGrabber;