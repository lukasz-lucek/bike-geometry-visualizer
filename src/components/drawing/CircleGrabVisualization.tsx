import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { findCircleBB } from '../../utils/GeometryUtils'
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Point2d } from '../../interfaces/Point2d';

export interface Circle {
  center: Point2d,
  radius: number,
  startAngle: number,
  endAngle: number,
}

interface CircleGrabVisualizationProps {
  circle: Circle,
  placementPoint: Point2d | null,
  layer: number,
  scale: number,
}

export function CircleGrabVisualization({ circle, placementPoint = null, scale = 1, layer = 3 }: CircleGrabVisualizationProps) {

  const {
    state: [geometryState,],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const [loadedImage, setLoadedImage] = useState<fabric.Image | null>(null);

  useEffect(() => {
    let top = circle.center.y - 3 * circle.radius - 30;
    let left = circle.center.x - circle.radius;

    if (placementPoint != null) {
      top = placementPoint.y - circle.radius * scale;
      left = placementPoint.x - circle.radius * scale;
    }

    if (geometryState.selectedFile) {
      const bound = findCircleBB(circle.center.x, circle.center.y, circle.radius);
      if (bound) {
        fabric.Image.fromURL(geometryState.selectedFile, (img) => {
          img.set({
            clipPath: new fabric.Circle({
              radius: circle.radius,
              originX: 'center',
              originY: 'center',
              startAngle: circle.startAngle,
              endAngle: circle.endAngle,
            })
          });
          setLoadedImage(img);
        },
          {
            top: top,
            left: left,
            width: bound.width,
            height: bound.height,
            scaleX: scale,
            scaleY: scale,
            cropX: bound.left,
            cropY: bound.top,
          });
        return () => {
          setLoadedImage(null);
        }
      }
    }
  }, [canvasState.canvas, circle, geometryState.selectedFile, placementPoint, scale]);

  useEffect(() => {
    if (loadedImage) {
      console.log("inserting circle at layer: " + layer)
      canvasState.canvas?.addObjectToLayer(loadedImage, layer);
      canvasState.canvas?.renderAll();
      return () => {
        canvasState.canvas?.removeObjectFromAnyLayer(loadedImage);
        canvasState.canvas?.renderAll();
      }
    }
  }, [loadedImage]);

  return (
    <>
    </>
  );
}

export default CircleGrabVisualization;