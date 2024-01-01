import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { findPxPerMm } from '../../utils/GeometryUtils';
import { Point2d } from '../../interfaces/Point2d';

interface BackgroundImageProps {
  isGrayedOut: Boolean;
  desiredPxPerMM: number | null;
  focusPoint: Point2d | null;
}

export function BackgroundImage({ isGrayedOut = false, desiredPxPerMM = null, focusPoint = null }: BackgroundImageProps) {
  const [fabricObject, setFabricObject] = useState<fabric.Image | null>(null);

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const {
    state: [geometryState,],
  } = useGeometryContext();

  const focusMM = 700;
  let focusZoom = 1;

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas || !geometryState.selectedFile) {
      return;
    }
    let pxPerMm = desiredPxPerMM;
    if (geometryState.wheelbase) {
      const rearWheelCenter = geometryState.geometryPoints["rearWheelCenter"];
      const frontWheelCenter = geometryState.geometryPoints["frontWheelCenter"];

      if (rearWheelCenter && frontWheelCenter) {
        pxPerMm = findPxPerMm(rearWheelCenter, frontWheelCenter, geometryState.wheelbase);
        if (focusPoint && canvas.height && pxPerMm){
          focusZoom = canvas.height / (focusMM * pxPerMm);
        }
      }
    }
    let ratio = 1;
    if (desiredPxPerMM && pxPerMm) {
      ratio = desiredPxPerMM / pxPerMm;
    }


    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    fabric.Image.fromURL(geometryState.selectedFile, (img) => {
      let zoom = 1;
      if (canvas.width && img.width && canvas.height && img.height) {
        zoom = Math.min(canvas.width / img.width, canvas.height / img.height);
      }
      img.lockMovementX = true;
      img.lockMovementY = true;
      img.opacity = isGrayedOut ? 0.4 : 1.0;
      img.scaleX = ratio;
      img.scaleY = ratio;
      //reset zoom from previous use
      canvas.setZoom(1);
      if (focusPoint == null) {
        canvas.setZoom(zoom);
      } else if (pxPerMm && canvas.width && canvas.height) {
        const panPoint : fabric.IPoint = {x: focusPoint.x - 0.5*focusMM*pxPerMm*canvas.width/canvas.height, y: focusPoint.y - 0.5*focusMM*pxPerMm}
        canvas.absolutePan(panPoint);
        canvas.setZoom(focusZoom);
      }
      canvas.selection = false;
      canvas.interactive = false;
      setFabricObject(img);
    });
  }, [geometryState.wheelbase, geometryState.selectedFile, canvasState.canvas]);

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (canvas && fabricObject != null) {
      canvas.insertAt(fabricObject, 0, false);
      canvas.renderAll();
      return () => {
        canvas.remove(fabricObject);
        canvas.renderAll();
      }
    }

  }, [fabricObject]);

  return (
    <>
    </>
  );
}

export default BackgroundImage;