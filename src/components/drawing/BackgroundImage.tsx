import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { findPxPerMm } from '../../utils/GeometryUtils';

interface BackgroundImageProps {
  isGrayedOut: Boolean;
  desiredPxPerMM: number | null;
}

export function BackgroundImage({isGrayedOut = false, desiredPxPerMM = null} : BackgroundImageProps) {
  const [fabricObject, setFabricObject] = useState<fabric.Image | null>(null);

  const {
    state: [canvasState, ],
  } = useCanvasContext();

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas || !geometryState.selectedFile) {
      return;
    }
    let pxPerMm = desiredPxPerMM;
    if (desiredPxPerMM && geometryState.wheelbase) {
      const rearWheelCenter = geometryState.geometryPoints["rearWheelCenter"];
      const frontWheelCenter = geometryState.geometryPoints["frontWheelCenter"];

      if (rearWheelCenter && frontWheelCenter) {
        pxPerMm = findPxPerMm(rearWheelCenter, frontWheelCenter, geometryState.wheelbase);
      }
    }
    let ratio = 1;
    if (desiredPxPerMM && pxPerMm) {
      ratio = desiredPxPerMM / pxPerMm;
    }
    
    
    canvas.setViewportTransform([1,0,0,1,0,0]);
    fabric.Image.fromURL(geometryState.selectedFile, (img) => {
      let zoom=1;
      if (canvas.width && img.width && canvas.height && img.height) {
        zoom = Math.min(canvas.width / img.width, canvas.height / img.height);
      }
      img.lockMovementX = true;
      img.lockMovementY = true;
      img.opacity = isGrayedOut ? 0.4 : 1.0;
      img.scaleX = ratio;
      img.scaleY = ratio;
      canvas.setZoom(zoom);
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