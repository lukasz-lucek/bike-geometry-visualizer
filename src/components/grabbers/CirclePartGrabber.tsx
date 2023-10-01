import Color from 'color';
import React, { useEffect, useState } from 'react';
import { Point2d } from '../../interfaces/Point2d';
import CircleMarker, { CircleMarkerData } from '../drawing/CircleMarker';

interface CirclePartGrabberProps {
  radius : number
  centerPoint : Point2d | null;
  pxPerMm : number,
  strokeWidth : number,
  placementPoint : Point2d | null,
  desiredPxPerMM: number | null,
  layer : number,
}

export function CirclePartGrabber(
  {
    radius,
    centerPoint,
    pxPerMm,
    strokeWidth,
    placementPoint=null,
    desiredPxPerMM=null,
    layer=3
  } : CirclePartGrabberProps) {

  const [circleMarker, setCircleMarker] = useState<CircleMarkerData | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!centerPoint) {
      return;
    }

    const newCircleMarker = {
      circle : {
        center: centerPoint,
        radius: radius * pxPerMm,
        startAngle: 0,
        endAngle: 360,
      },
      strokeWidth: strokeWidth,
      color: Color('blue')
    }
    setCircleMarker(newCircleMarker);
    if (desiredPxPerMM != null) {
      setScale(desiredPxPerMM/pxPerMm);
    }
  }, [radius, centerPoint, pxPerMm, strokeWidth, desiredPxPerMM])


  return (
    <>
      {circleMarker && 
        <CircleMarker
          circleMarker={circleMarker}
          placementPoint={placementPoint}
          scale={scale}
          layer={layer}/>
      }
    </>
  );
}

export default CirclePartGrabber;