import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../contexts/CanvasContext';

export function PointMarker({shape}) {
  const {
    state: [canvasState, ],
  } = useCanvasContext();
  
  useEffect(() => {
    const canvas = canvasState.canvas;
    const circle = new fabric.Circle({
      radius: 13,
      fill: 'transparent', // Set the fill to transparent
      stroke: shape.color, // Set the stroke color
      strokeWidth: 3, // Set the stroke width
      selectable: false,
      evented: false,
      left: shape.shape.x - 13,
      top: shape.shape.y - 13,
    });

    canvas.insertAt(circle, 1);
    canvas.renderAll();

    return () => {
      canvas.remove(circle);
      canvas.renderAll();
    }

  }, [shape, canvasState.canvas]);

  return (
    <>
    </>
  );
}

export default PointMarker;