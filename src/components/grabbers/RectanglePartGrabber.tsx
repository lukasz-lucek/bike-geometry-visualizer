import Color from 'color';
import React, { useEffect, useState } from 'react';
import { equalPoints, Point2d } from '../../interfaces/Point2d';
import { findIntermediatePoint } from '../../utils/GeometryUtils';
import {RectangleMarker, RectangleMarkerData} from '../drawing/RectangleMarker';

interface RectanglePartGrabberProps {
  leftOffset : number
  rightOffset : number
  width : number
  anchorPoints : {
    tl: Point2d | null;
    bl: Point2d | null;
    tr: Point2d | null;
    br: Point2d | null;
  }
  pxPerMm : number,
  strokeWidth : number,
  leftPlacementPoint : Point2d | null,
  rightPlacementPoint : Point2d | null,
  desiredPxPerMM: number | null,
  layer : number,
}

export function RectanglePartGrabber(
  {leftOffset,
    rightOffset,
    width,
    anchorPoints,
    pxPerMm,
    strokeWidth,
    leftPlacementPoint=null,
    rightPlacementPoint=null,
    desiredPxPerMM=null,
    layer=3,
  } : RectanglePartGrabberProps) {


  const [rectangleMarker, setRectangleMarker] = useState<RectangleMarkerData | null>(null);

  useEffect(() => {
    let leftOffsetPoint = null;
    let rightOffsetPoint = null;
    // if (!overridePoints) {
    if (!anchorPoints.tl || !anchorPoints.bl || !anchorPoints.tr || !anchorPoints.br) {
      return;
    }
    if (equalPoints(anchorPoints.tl, anchorPoints.bl)) {
      const ba : Point2d = {
        x:anchorPoints.bl.x,
        y:anchorPoints.bl.y-10
      };
      leftOffsetPoint = findIntermediatePoint(anchorPoints.tl, ba, leftOffset  * pxPerMm);
    } else {
      leftOffsetPoint = findIntermediatePoint(anchorPoints.tl, anchorPoints.bl, leftOffset  * pxPerMm);
    }
    if (equalPoints(anchorPoints.tr, anchorPoints.br)) {
      const ba = {
        x:anchorPoints.br.x,
        y:anchorPoints.br.y-10
      };
      rightOffsetPoint = findIntermediatePoint(anchorPoints.tr, ba, leftOffset  * pxPerMm);
    } else {
      rightOffsetPoint = findIntermediatePoint(anchorPoints.tr, anchorPoints.br, rightOffset  * pxPerMm);
    }
    // } else {
    //   leftOffsetPoint = overridePoints.leftOffsetPoint;
    //   rightOffsetPoint = overridePoints.rightOffsetPoint;
    // }
    if (!leftOffsetPoint || !rightOffsetPoint) {
      return;
    }

    const newRectanbleMarker : RectangleMarkerData = {
      rectangle: {
        p1: leftOffsetPoint,
        p2: rightOffsetPoint,
        width: width * pxPerMm,
      },
      strokeWidth: strokeWidth,
      color: Color('blue')
    } 
    setRectangleMarker(newRectanbleMarker);
  }, [leftOffset, rightOffset, width, anchorPoints, pxPerMm, strokeWidth])


  return (
    <>
      {rectangleMarker &&
      <RectangleMarker
        rectangleMarker={rectangleMarker}
        leftPlacementPoint={leftPlacementPoint}
        rightPlacementPoint={rightPlacementPoint}
        layer={layer}
        scaling={desiredPxPerMM?desiredPxPerMM/pxPerMm:1}
      />}
    </>
  );
}

export default RectanglePartGrabber;