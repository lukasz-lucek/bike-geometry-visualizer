// import Color from 'color';
// import React, { useEffect, useState } from 'react';
// import { equalPoints, Point2d } from '../../interfaces/Point2d';
// import { findIntermediatePoint } from '../../utils/GeometryUtils';
// import { RectangleMarker, RectangleMarkerData } from '../drawing/RectangleMarker';

import React, { useEffect } from "react";
import { Point2d } from "../../interfaces/Point2d";
import { OffsetSpline } from "../../interfaces/Spline";
import { useCanvasContext } from "../../contexts/CanvasContext";
import { fabric } from 'fabric';

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

  useEffect(() => {
    if (!canvasState.canvas) {
      return;
    }
    
    
    var path1 = new fabric.Path('M 10 10 L 50 10 L 50 50 L 10 50', { stroke: 'red' });
    var path2 = new fabric.Path('L 50 10 L 90 10 L 90 50 L 50 50', { stroke: 'blue' });

    // Group paths into an array
    var paths = [path1, path2];

    // Combine paths into a single path
    const compined = paths.map(function(path) { return path.path?.join(' '); }).join(' ');

    var combinedPath = new fabric.Path(compined, { stroke: 'red', fill: ''});
    canvasState.canvas.addObjectToLayer(combinedPath, layer);

    const handlebarOutline = geometry.getFabricPath();
    if (!handlebarOutline) {
      return;
    }
    canvasState.canvas.addObjectToLayer(handlebarOutline, layer);
    
    canvasState.canvas.renderAll();
    return () => {
      if (canvasState.canvas) {
        canvasState.canvas.removeObjectFromAnyLayer(handlebarOutline);
        canvasState.canvas.removeObjectFromAnyLayer(combinedPath);
        canvasState.canvas.renderAll();
      }
    }

  }, [geometry, raise, setback, reach, drop, rotation, pxPerMm, mountingPoint, desiredPxPerMM, layer, canvasState.canvas])


  return (
    <>
      
    </>
  );
}

export default HandlebarGrabber;