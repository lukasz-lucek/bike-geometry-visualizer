import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { findAngle, findBBWithMargins, findBBFromImage, findDistance } from '../../utils/GeometryUtils'
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Point2d } from '../../interfaces/Point2d';

export interface Rectangle {
  p1: Point2d,
  p2: Point2d,
  width: number,
}

interface RectangleGrabVisualizationProps {
  rectangle: Rectangle,
  leftPlacementPoint: Point2d | null,
  rightPlacementPoint: Point2d | null,
  layer: number,
  scaling: number,
  margin: number,
}

export function RectangleGrabVisualization(
  {
    rectangle,
    leftPlacementPoint = null,
    rightPlacementPoint = null,
    layer = 3,
    scaling = 1,
    margin = 0,
  }: RectangleGrabVisualizationProps) {

  const {
    state: [geometryState,],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const [loadedImage, setLoadedImage] = useState<fabric.Image | null>(null);

  useEffect(() => {
    let scaleX = scaling;
    let scaleY = scaling;
    const trueMargin = margin*scaling;
    const orgDistance = findDistance(rectangle.p1, rectangle.p2);
    if (leftPlacementPoint && rightPlacementPoint) {
      const newDistance = findDistance(leftPlacementPoint, rightPlacementPoint);
      scaleX = newDistance / orgDistance;
    }
    if (geometryState.selectedFile) {
      const bound = findBBWithMargins(rectangle.p1, rectangle.p2, rectangle.width, trueMargin);
      if (bound) {

        const angle = findAngle(rectangle.p1, rectangle.p2)
        fabric.Image.fromURL(geometryState.selectedFile, (img) => {
          img.rotate(-angle);
          const bound2 = findBBFromImage(img);

          fabric.Image.fromURL(img.toDataURL({}), (cimg) => {
            if (leftPlacementPoint && rightPlacementPoint) {
              const cimgWidth = cimg.width ? cimg.width : 0;
              const cimgHeight = cimg.height ? cimg.height : 0;
              const landingAngle = findAngle(leftPlacementPoint, rightPlacementPoint);
              const landingPoint = {
                x: (leftPlacementPoint.x + rightPlacementPoint.x) / 2,
                y: (leftPlacementPoint.y + rightPlacementPoint.y) / 2,
              }
              fabric.Image.fromURL(cimg.toDataURL({}), (movedImage) => {
                movedImage.rotate(landingAngle);
                setLoadedImage(movedImage);
              }, {
                top: landingPoint.y - scaleY * cimgHeight / 2,
                left: landingPoint.x - scaleX * cimgWidth / 2,
              });
            } else {
              setLoadedImage(cimg);
            }
          },
            {
              width: orgDistance + trueMargin,
              height: rectangle.width,
              scaleX: scaleX,
              scaleY: scaleY,
              cropY: (bound2.height - rectangle.width) / 2,
              cropX: (bound2.width - orgDistance - trueMargin) / 2,
            })
        },
          {
            top: 0,
            left: 0,
            width: bound.width,
            height: bound.height,
            cropX: bound.left,
            cropY: bound.top,
          });
        return () => {
          setLoadedImage(null);
        }
      }
    }

  }, [canvasState.canvas, rectangle, geometryState.selectedFile]);

  useEffect(() => {
    if (loadedImage) {
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

export default RectangleGrabVisualization;