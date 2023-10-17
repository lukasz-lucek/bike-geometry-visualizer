import React, { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import CircleGrabVisualization, { Circle } from './CircleGrabVisualization';
import { useCanvasContext } from '../../contexts/CanvasContext';
import Color from 'color';
import { Point2d } from '../../interfaces/Point2d';

export interface CircleMarkerData {
  circle: Circle,
  color: Color,
  strokeWidth: number,
}
interface CircleMarkerProps {
  circleMarker: CircleMarkerData,
  placementPoint: Point2d | null,
  scale: number,
  layer: number,
}

export function CircleMarker({ circleMarker, placementPoint = null, scale = 1, layer = 3 }: CircleMarkerProps) {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  useEffect(() => {
    // if (sh.startAngle && sh.endAngle) {
    const circle = new fabric.Circle({
      left: circleMarker.circle.center.x - circleMarker.circle.radius,
      top: circleMarker.circle.center.y - circleMarker.circle.radius,
      radius: circleMarker.circle.radius,
      fill: 'transparent',
      stroke: circleMarker.color.toString(),
      strokeWidth: circleMarker.strokeWidth,
      startAngle: circleMarker.circle.startAngle,
      endAngle: circleMarker.circle.endAngle
    });
    canvasState.canvas?.insertAt(circle, 2, false);

    canvasState.canvas?.renderAll();

    return () => {
      canvasState.canvas?.remove(circle);
      canvasState.canvas?.renderAll();
    }

  }, [circleMarker, canvasState.canvas]);

  return (
    <>
      <CircleGrabVisualization
        circle={circleMarker.circle}
        placementPoint={placementPoint}
        scale={scale}
        layer={layer} />
    </>
  );
}

export default CircleMarker;