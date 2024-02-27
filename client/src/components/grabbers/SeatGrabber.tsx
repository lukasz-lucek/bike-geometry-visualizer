// import Color from 'color';
// import React, { useEffect, useState } from 'react';
// import { equalPoints, Point2d } from '../../interfaces/Point2d';
// import { findIntermediatePoint } from '../../utils/GeometryUtils';
// import { RectangleMarker, RectangleMarkerData } from '../drawing/RectangleMarker';

import React, { useEffect, useState } from "react";
import { ColorPoint2d, Point2d } from "../../interfaces/Point2d";
import { useCanvasContext } from "../../contexts/CanvasContext";
import { fabric } from 'fabric';
import { useGeometryContext } from "../../contexts/GeometryContext";
import Color from "color";
import { Polygon } from "../../interfaces/Polygon";
import { findAngle } from "../../utils/GeometryUtils";

interface SeatGrabberProps {
  seatPolygon: Polygon;
  seatRotation: number;
  railsAngle: number;
  seatSetback: number;
  pxPerMm: number;
  orgMountingPoint?: Point2d | null;
  mountingPoint?: Point2d | null;
  desiredPxPerMM?: number | null;
  layer?: number;
}

export function SeatGrabber(
  { seatPolygon,
    seatRotation,
    railsAngle,
    seatSetback,
    pxPerMm,
    orgMountingPoint = null,
    mountingPoint = null,
    desiredPxPerMM = null,
    layer = 3,
  }: SeatGrabberProps) {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const {
    state: [geometryState,],
  } = useGeometryContext();

  const [seatImage, setSeatImage] = useState<fabric.Image | null>(null);

  useEffect(() => {
    if (!canvasState.canvas || !geometryState.selectedFile) {
      return;
    }

    if (!mountingPoint || !orgMountingPoint) {
      return;
    }

    const mainScale = desiredPxPerMM ? desiredPxPerMM / pxPerMm : 1;
    const desiredScale = desiredPxPerMM ? desiredPxPerMM : 1;

    //getting seat polygon parameters
    const fabricSeatPolygon = new fabric.Polygon(seatPolygon.vertices);
    const seatBoundungBox = fabricSeatPolygon.getBoundingRect();

    //calculating seat polygon transform
    const leftSeatOfsetPx = (orgMountingPoint.x - seatBoundungBox.left) * mainScale;
    const topSeatOffsetPx = (orgMountingPoint.y - seatBoundungBox.top) * mainScale;

    const seatTopLeft = new fabric.Point(
      mountingPoint.x - leftSeatOfsetPx,
      mountingPoint.y - topSeatOffsetPx,
    );
    const rotationPoint = new fabric.Point(mountingPoint.x, mountingPoint.y);
    const rotationRadians = fabric.util.degreesToRadians(seatRotation);
    const seatTopLeftRotated = fabric.util.rotatePoint(seatTopLeft, rotationPoint, rotationRadians);

    const finalRailsAngle = fabric.util.degreesToRadians(railsAngle + seatRotation);
    const setbackX = seatSetback * Math.cos(finalRailsAngle);
    const setbackY = seatSetback * Math.sin(finalRailsAngle);

    //cutting seat from original image and placing in correct position
    fabric.Image.fromURL(geometryState.selectedFile, (img) => {
      if (!canvasState.canvas) {
        return;
      }
      
      fabricSeatPolygon.top = seatBoundungBox.top > 0 ? 0 : seatBoundungBox.top;
      fabricSeatPolygon.left = seatBoundungBox.left > 0 ? 0 : seatBoundungBox.left;
      fabricSeatPolygon.originX = "center";
      fabricSeatPolygon.originY = "center";
      img.clipPath = fabricSeatPolygon
      setSeatImage(img);
    },
    {
      top: seatTopLeftRotated.y + setbackY,
      left: seatTopLeftRotated.x + setbackX,
      width: seatBoundungBox.width,
      height: seatBoundungBox.height,
      cropX: seatBoundungBox.left,
      cropY: seatBoundungBox.top,
      scaleX: mainScale,
      scaleY: mainScale,
      angle: seatRotation, //
      evented: false
    });

  }, [seatPolygon, seatRotation, railsAngle, seatSetback, pxPerMm, orgMountingPoint, mountingPoint, desiredPxPerMM, layer, canvasState.canvas, geometryState.selectedFile])

  useEffect(() => {
    if (seatImage) {
      console.log("inserting seat at layer: " + layer+1);
      canvasState.canvas?.addObjectToLayer(seatImage, layer+1);
      canvasState.canvas?.renderAll();
      return () => {
        canvasState.canvas?.removeObjectFromAnyLayer(seatImage);
        canvasState.canvas?.renderAll();
      }
    }
  }, [seatImage]);

  return (
    <>
    </>
  );
}

export default SeatGrabber;