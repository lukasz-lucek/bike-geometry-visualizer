// import Color from 'color';
// import React, { useEffect, useState } from 'react';
// import { equalPoints, Point2d } from '../../interfaces/Point2d';
// import { findIntermediatePoint } from '../../utils/GeometryUtils';
// import { RectangleMarker, RectangleMarkerData } from '../drawing/RectangleMarker';

import React, { useEffect, useState } from "react";
import { ColorPoint2d, Point2d } from "../../interfaces/Point2d";
import { OffsetSpline } from "../../interfaces/Spline";
import { useCanvasContext } from "../../contexts/CanvasContext";
import { fabric } from 'fabric';
import { useGeometryContext } from "../../contexts/GeometryContext";
import PointMarker from "../drawing/PointMarker";
import Color from "color";

interface HandlebarGrabberProps {
  geometry: OffsetSpline;
  raise: number;
  setback: number;
  reach: number;
  drop: number;
  rotation: number;
  shiftersMountOffset: number;
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
    shiftersMountOffset,
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
  const [shiftersMountPoint, setShiftersMountPoint] = useState<ColorPoint2d | null>(null);

  useEffect(() => {
    if (!canvasState.canvas) {
      return;
    }
    
    const handlebarOutline = geometry.getFabricPath();
    if (!handlebarOutline) {
      return;
    }

    const boundingBox = handlebarOutline.getBoundingRect();

    const mainScale = desiredPxPerMM ? desiredPxPerMM / pxPerMm : 1;
    const desiredScale = desiredPxPerMM ? desiredPxPerMM : 1;

    let {reach : orgReachPx, drop : orgDropPx, startPoint, } = geometry.getReachAndDropInPx();

    if (!orgReachPx || !orgDropPx) {
      return;
    }

    if (!mountingPoint || !startPoint) {
      return;
    }

    const leftMountOffsetPx = startPoint.x - boundingBox.left;
    const topMountOffsetPx = startPoint.y - boundingBox.top;

    let orgHandlebarReach = orgReachPx / pxPerMm;
    const scaleX = reach / orgHandlebarReach;

    let orgHandlebarDrop = orgDropPx / pxPerMm;
    const scaleY = drop / orgHandlebarDrop;

    const topLeft = new fabric.Point(
      mountingPoint.x - leftMountOffsetPx * mainScale * scaleX - setback * desiredScale,
      mountingPoint.y - topMountOffsetPx * mainScale * scaleY - raise * desiredScale
    );

    const rotationPoint = new fabric.Point(mountingPoint.x, mountingPoint.y);
    const rotationRadians = fabric.util.degreesToRadians(rotation);
    const topLeftRotated = fabric.util.rotatePoint(topLeft, rotationPoint, rotationRadians)

    const orgShiftersMountPoint = geometry.getPointAlongSpline(shiftersMountOffset);
    if (orgShiftersMountPoint) {
      let mountPoint = new fabric.Point(
        topLeft.x + (orgShiftersMountPoint.x - boundingBox.left) * mainScale * scaleX,
        topLeft.y + (orgShiftersMountPoint.y - boundingBox.top) * mainScale * scaleY
      )

      mountPoint = fabric.util.rotatePoint(mountPoint, rotationPoint, rotationRadians)

      const mountPointColor : ColorPoint2d = {
        color: Color('yellow'),
        x: mountPoint.x,
        y: mountPoint.y
      }

      setShiftersMountPoint(mountPointColor);
    }
    

    if (geometryState.selectedFile) {
      fabric.Image.fromURL(geometryState.selectedFile, (img) => {
        if (!canvasState.canvas) {
          return;
        }
        //const filter = new fabric.Image.filters.Invert();
        //img.filters!.push(filter);
        //img.applyFilters();
        
        handlebarOutline.top = boundingBox.top > 0 ? 0 : boundingBox.top;
        handlebarOutline.left = boundingBox.left > 0 ? 0 : boundingBox.left;
        handlebarOutline.originX = "center";
        handlebarOutline.originY = "center";
        img.clipPath = handlebarOutline
        setLoadedImage(img);
      },
      {
        // top: boundingBox.top > 0 ? boundingBox.top * mainScale: 0,
        // left: boundingBox.left > 0 ? boundingBox.left * mainScale : 0,
        top: topLeftRotated.y,
        left: topLeftRotated.x,
        width: boundingBox.width,
        height: boundingBox.height,
        cropX: boundingBox.left,
        cropY: boundingBox.top,
        scaleX: mainScale * scaleX,
        scaleY: mainScale * scaleY,
        angle: rotation,
        evented: false
      });
    }

    // const mainLineBB = geometry.getMainLineBB();
    // if (!mainLineBB) {
    //   return;
    // }
    // const rect = new fabric.Rect({...mainLineBB, stroke: 'blue', fill: '', evented: false});
    // rect.width = rect.width! * mainScale * scaleX;
    // rect.height = rect.height! * mainScale * scaleY;

    // const topLeftRect = new fabric.Point(
    //   mountingPoint.x - leftMountOffsetPx * mainScale * scaleX - setback * desiredScale + (mainLineBB.left - boundingBox.left) * mainScale,
    //   mountingPoint.y - topMountOffsetPx * mainScale * scaleY - raise * desiredScale + (mainLineBB.top - boundingBox.top) * mainScale
    // );

    // const topLeftRectRotated = fabric.util.rotatePoint(topLeftRect, new fabric.Point(mountingPoint.x, mountingPoint.y), fabric.util.degreesToRadians(rotation))

    // rect.top = topLeftRectRotated.y;
    // rect.left = topLeftRectRotated.x;
    // rect.angle = rotation;
    // canvasState.canvas.addObjectToLayer(rect, layer+1);
    
    // canvasState.canvas.renderAll();
    // return () => {
    //   if (canvasState.canvas) {
    //     canvasState.canvas?.removeObjectFromAnyLayer(rect);
    //     canvasState.canvas.renderAll();
    //   }
    // }

  }, [geometry, raise, setback, reach, drop, rotation, shiftersMountOffset, pxPerMm, mountingPoint, desiredPxPerMM, layer, canvasState.canvas, geometryState.selectedFile])

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
      {shiftersMountPoint && <PointMarker shape={shiftersMountPoint} layer={10}/>}
    </>
  );
}

export default HandlebarGrabber;