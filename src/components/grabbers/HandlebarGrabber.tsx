// import Color from 'color';
// import React, { useEffect, useState } from 'react';
// import { equalPoints, Point2d } from '../../interfaces/Point2d';
// import { findIntermediatePoint } from '../../utils/GeometryUtils';
// import { RectangleMarker, RectangleMarkerData } from '../drawing/RectangleMarker';

import React, { useEffect, useState } from "react";
import { Point2d } from "../../interfaces/Point2d";
import { OffsetSpline } from "../../interfaces/Spline";
import { useCanvasContext } from "../../contexts/CanvasContext";
import { fabric } from 'fabric';
import { useGeometryContext } from "../../contexts/GeometryContext";

interface HandlebarGrabberProps {
  geometry: OffsetSpline;
  raise: number;
  setback: number;
  reach: number;
  drop: number;
  rotation: number;
  pxPerMm: number,
  mountingPoint?: Point2d | null,
  desiredPxPerMM?: number | null,
  layer?: number,
}

export function HandlebarGrabber(
  { geometry,
    raise,
    setback,
    reach,
    drop,
    rotation,
    pxPerMm,
    mountingPoint = null,
    desiredPxPerMM = null,
    layer = 3,
  }: HandlebarGrabberProps) {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const {
    state: [geometryState,],
  } = useGeometryContext();

  const [loadedImage, setLoadedImage] = useState<fabric.Image | null>(null);

  useEffect(() => {
    if (!canvasState.canvas) {
      return;
    }
    
    const handlebarOutline = geometry.getFabricPath();
    if (!handlebarOutline) {
      return;
    }

    const boundingBox = handlebarOutline.getBoundingRect();
    
    if (geometryState.selectedFile) {
      fabric.Image.fromURL(geometryState.selectedFile, (img) => {
        if (!canvasState.canvas) {
          return;
        }
        const filter = new fabric.Image.filters.Invert();
        img.filters!.push(filter);
        img.applyFilters();
        var clipPath = new fabric.Circle({
          radius: 100,
          top: -100,
          left: -100
        });
        
        handlebarOutline.top = boundingBox.top > 0 ? 0 : boundingBox.top;
        handlebarOutline.left = boundingBox.left > 0 ? 0 : boundingBox.left;
        handlebarOutline.originX = "center";
        handlebarOutline.originY = "center";
        img.clipPath = handlebarOutline
        setLoadedImage(img);
      },
      {
        top: boundingBox.top > 0 ? boundingBox.top : 0,
        left: boundingBox.left > 0 ? boundingBox.left : 0,
        width: boundingBox.width,
        height: boundingBox.height,
        cropX: boundingBox.left,
        cropY: boundingBox.top,
        evented: false
      });
    }

    const mainLineBB = geometry.getMainLineBB();
    const rect = new fabric.Rect({...mainLineBB, stroke: 'blue', fill: '', evented: false});
    canvasState.canvas.addObjectToLayer(rect, layer+1);
    
    canvasState.canvas.renderAll();
    return () => {
      if (canvasState.canvas) {
        canvasState.canvas?.removeObjectFromAnyLayer(rect);
        canvasState.canvas.renderAll();
      }
    }

  }, [geometry, raise, setback, reach, drop, rotation, pxPerMm, mountingPoint, desiredPxPerMM, layer, canvasState.canvas, geometryState.selectedFile])

  useEffect(() => {
    if (loadedImage) {
      console.log("inserting handlebar at layer: " + layer);
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

export default HandlebarGrabber;