import React, {useEffect, useMemo } from 'react';
import {RectangleGrabVisualization, Rectangle} from './RectangleGrabVisualization';
import {findRectangle} from '../../utils/GeometryUtils'
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Point2d } from '../../interfaces/Point2d';
import Color from 'color';

export interface RectangleMarkerData {
  rectangle: Rectangle,
  color: Color,
  strokeWidth: number,
}

interface RectangleMarkerProps {
  rectangleMarker: RectangleMarkerData,
  leftPlacementPoint: Point2d | null,
  rightPlacementPoint: Point2d | null,
  layer: number,
  scaling: number
}

export function RectangleMarker(
  {
    rectangleMarker,
    leftPlacementPoint=null,
    rightPlacementPoint=null,
    layer=3,
    scaling=1
  } : RectangleMarkerProps) {

  const {
    state: [canvasState, ],
  } = useCanvasContext();

  const fabricRectangle = useMemo<fabric.Rect>(() => {
    const rect = findRectangle(rectangleMarker.rectangle.p1,rectangleMarker.rectangle.p2,rectangleMarker.rectangle.width);
    rect.fill = 'transparent';
    rect.stroke = rectangleMarker.color.toString();
    rect.strokeWidth = rectangleMarker.strokeWidth;

    return rect;
  }, [rectangleMarker, canvasState.canvas]);
  
  useEffect(() => {
    canvasState.canvas?.insertAt(fabricRectangle, 2, false);
    canvasState.canvas?.renderAll();

    return () => {
      canvasState.canvas?.remove(fabricRectangle);
      canvasState.canvas?.renderAll();
    }

  }, [rectangleMarker, canvasState.canvas]);

  return (
    <>
      <RectangleGrabVisualization
        rectangle={rectangleMarker.rectangle}
        leftPlacementPoint={leftPlacementPoint}
        rightPlacementPoint={rightPlacementPoint}
        layer={layer}
        scaling={scaling}/>
    </>
  );
}

export default RectangleMarker;