import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useGeometryContext } from '../contexts/GeometryContext';
import { useCanvasContext } from '../contexts/CanvasContext';

export function BackgroundImage() {
  const [fabricObject, setFabricObject] = useState(null);

  const {
    state: [canvasState, ],
  } = useCanvasContext();

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  useEffect(() => {
    const canvas = canvasState.canvas;
    canvas.setViewportTransform([1,0,0,1,0,0]);
    fabric.Image.fromURL(geometryState.selectedFile, (img) => {
        img.lockMovementX = true;
        img.lockMovementY = true;
        canvas.setZoom(Math.min(canvas.width / img.width, canvas.height / img.height));
        canvas.selection = false;
        canvas.interactive = false;
        setFabricObject(img);
    });
  }, [geometryState.selectedFile, canvasState.canvas]);

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (fabricObject != null) {
      canvas.insertAt(fabricObject, 0);
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