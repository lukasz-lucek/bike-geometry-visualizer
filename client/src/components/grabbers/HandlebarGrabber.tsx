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
import { Polygon } from "../../interfaces/Polygon";
import { findAngle } from "../../utils/GeometryUtils";

interface HandlebarGrabberProps {
  geometry: OffsetSpline;
  raise: number;
  setback: number;
  reach: number;
  drop: number;
  rotation: number;
  shiftersMountOffset: number;
  orgShifterMountOffset: number;
  shifterPolygon: Polygon;
  pxPerMm: number;
  mountingPoint?: Point2d | null;
  desiredPxPerMM?: number | null;
  layer?: number;
}

export function HandlebarGrabber(
  { geometry,
    raise,
    setback,
    reach,
    drop,
    rotation,
    shiftersMountOffset,
    orgShifterMountOffset,
    shifterPolygon,
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

  const [handlebarImage, setHandlebarImage] = useState<fabric.Image | null>(null);
  const [shifterImage, setShifterImage] = useState<fabric.Image | null>(null);
  const [shiftersMountPoint, setShiftersMountPoint] = useState<ColorPoint2d | null>(null);

  useEffect(() => {
    if (!canvasState.canvas || !geometryState.selectedFile) {
      return;
    }

    let {reach : orgReachPx, drop : orgDropPx, startPoint, } = geometry.getReachAndDropInPx();

    if (!orgReachPx || !orgDropPx) {
      return;
    }

    if (!mountingPoint || !startPoint) {
      return;
    }

    // getting handlebar outline parameters
    const handlebarOutline = geometry.getFabricPath();
    if (!handlebarOutline) {
      return;
    }

    const boundingBox = handlebarOutline.getBoundingRect();

    const mainScale = desiredPxPerMM ? desiredPxPerMM / pxPerMm : 1;
    const desiredScale = desiredPxPerMM ? desiredPxPerMM : 1;

    // calculating handlebar transformation parameters
    let orgHandlebarReach = orgReachPx / pxPerMm;
    const scaleX = reach / orgHandlebarReach;

    let orgHandlebarDrop = orgDropPx / pxPerMm;
    const scaleY = drop / orgHandlebarDrop;

    const leftMountOffsetPx = (startPoint.x - boundingBox.left) * mainScale * scaleX;
    const topMountOffsetPx = (startPoint.y - boundingBox.top) * mainScale * scaleY;

    const topLeft = new fabric.Point(
      mountingPoint.x - leftMountOffsetPx - setback * desiredScale,
      mountingPoint.y - topMountOffsetPx - raise * desiredScale
    );

    const rotationPoint = new fabric.Point(mountingPoint.x, mountingPoint.y);
    const rotationRadians = fabric.util.degreesToRadians(rotation);
    const topLeftRotated = fabric.util.rotatePoint(topLeft, rotationPoint, rotationRadians)

    //cutting handlebar from original image and placing in correct position
    fabric.Image.fromURL(geometryState.selectedFile, (img) => {
      if (!canvasState.canvas) {
        return;
      }
      
      handlebarOutline.top = boundingBox.top > 0 ? 0 : boundingBox.top;
      handlebarOutline.left = boundingBox.left > 0 ? 0 : boundingBox.left;
      handlebarOutline.originX = "center";
      handlebarOutline.originY = "center";
      img.clipPath = handlebarOutline
      setHandlebarImage(img);
    },
    {
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

    //shifters mount point calculation
    const geometryShiftersMountPoint = geometry.getPointAlongSpline(shiftersMountOffset);
    const newTangent = geometry.getLineTangentAlongSpline(shiftersMountOffset);
    let additionalRotation = 0;
    let shiftersMountDiff = {x: 0, y: 0}
    if (!geometryShiftersMountPoint) {
      return;
    }

    let mountPoint = new fabric.Point(
      topLeft.x + (geometryShiftersMountPoint.x - boundingBox.left) * mainScale * scaleX,
      topLeft.y + (geometryShiftersMountPoint.y - boundingBox.top) * mainScale * scaleY
    )

    mountPoint = fabric.util.rotatePoint(mountPoint, rotationPoint, rotationRadians)

    const mountPointColor : ColorPoint2d = {
      color: Color('yellow'),
      x: mountPoint.x,
      y: mountPoint.y
    }

    setShiftersMountPoint(mountPointColor);

    const geometryOrgShiftersMountPoint = geometry.getPointAlongSpline(orgShifterMountOffset);
    
    if (!geometryOrgShiftersMountPoint) {
      return;
    }
    let orgMountPoint = new fabric.Point(
      topLeft.x + (geometryOrgShiftersMountPoint.x - boundingBox.left) * mainScale * scaleX,
      topLeft.y + (geometryOrgShiftersMountPoint.y - boundingBox.top) * mainScale * scaleY
    )

    orgMountPoint = fabric.util.rotatePoint(orgMountPoint, rotationPoint, rotationRadians)

    shiftersMountDiff.x = mountPoint.x - orgMountPoint.x
    shiftersMountDiff.y = mountPoint.y - orgMountPoint.y
    
    const orgTangent = geometry.getLineTangentAlongSpline(orgShifterMountOffset);
    if (orgTangent && newTangent) {
      additionalRotation = findAngle(newTangent.a, newTangent.b) - findAngle(orgTangent.a, orgTangent.b);
    }

    //getting shifters polygon parameters
    const fabricShiftersPolygon = new fabric.Polygon(shifterPolygon.vertices);
    const shiftersBoundungBox = fabricShiftersPolygon.getBoundingRect();

    //calculating shifter polygon transform
    const leftShifterffsetPx = (startPoint.x - shiftersBoundungBox.left) * mainScale * scaleX;
    const topShifterOffsetPx = (startPoint.y - shiftersBoundungBox.top) * mainScale * scaleY;

    const shifterTopLeft = new fabric.Point(
      mountingPoint.x - leftShifterffsetPx - setback * desiredScale,
      mountingPoint.y - topShifterOffsetPx - raise * desiredScale
    );
    
    const shifterTopLeftRotated = fabric.util.rotatePoint(shifterTopLeft, rotationPoint, rotationRadians);

    const additionalRotationRadians = fabric.util.degreesToRadians(additionalRotation);
    const shifterTopLeftRotatedByMountPoint = fabric.util.rotatePoint(shifterTopLeftRotated, orgMountPoint, additionalRotationRadians);

    //cutting shifters from original image and placing in correct position
    fabric.Image.fromURL(geometryState.selectedFile, (img) => {
      if (!canvasState.canvas) {
        return;
      }
      //const filter = new fabric.Image.filters.Invert();
      //img.filters!.push(filter);
      //img.applyFilters();
      
      fabricShiftersPolygon.top = shiftersBoundungBox.top > 0 ? 0 : shiftersBoundungBox.top;
      fabricShiftersPolygon.left = shiftersBoundungBox.left > 0 ? 0 : shiftersBoundungBox.left;
      fabricShiftersPolygon.originX = "center";
      fabricShiftersPolygon.originY = "center";
      img.clipPath = fabricShiftersPolygon
      setShifterImage(img);
    },
    {
      top: shifterTopLeftRotatedByMountPoint.y + shiftersMountDiff.y,
      left: shifterTopLeftRotatedByMountPoint.x + shiftersMountDiff.x,
      width: shiftersBoundungBox.width,
      height: shiftersBoundungBox.height,
      cropX: shiftersBoundungBox.left,
      cropY: shiftersBoundungBox.top,
      scaleX: mainScale * scaleX,
      scaleY: mainScale * scaleY,
      angle: rotation + additionalRotation, //
      evented: false
    });

  }, [geometry, raise, setback, reach, drop, rotation, shiftersMountOffset, pxPerMm, mountingPoint, desiredPxPerMM, layer, canvasState.canvas, geometryState.selectedFile])

  useEffect(() => {
    if (handlebarImage) {
      console.log("inserting handlebar at layer: " + layer);
      canvasState.canvas?.addObjectToLayer(handlebarImage, layer);
      canvasState.canvas?.renderAll();
      return () => {
        canvasState.canvas?.removeObjectFromAnyLayer(handlebarImage);
        canvasState.canvas?.renderAll();
      }
    }
  }, [handlebarImage]);

  useEffect(() => {
    if (shifterImage) {
      console.log("inserting shiofter at layer: " + layer+1);
      canvasState.canvas?.addObjectToLayer(shifterImage, layer+1);
      canvasState.canvas?.renderAll();
      return () => {
        canvasState.canvas?.removeObjectFromAnyLayer(shifterImage);
        canvasState.canvas?.renderAll();
      }
    }
  }, [shifterImage]);

  return (
    <>
      {/* {shiftersMountPoint && <PointMarker shape={shiftersMountPoint} layer={10}/>} */}
    </>
  );
}

export default HandlebarGrabber;