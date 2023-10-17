import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { ColorPoint2d } from '../../interfaces/Point2d';

export function PointMarker({ shape }: { shape: ColorPoint2d }) {
  const {
    state: [canvasState,],
  } = useCanvasContext();

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas) {
      return;
    }
    const circle = new fabric.Circle({
      radius: 13,
      fill: 'transparent', // Set the fill to transparent
      stroke: shape.color.toString(), // Set the stroke color
      strokeWidth: 3, // Set the stroke width
      selectable: false,
      evented: false,
      left: shape.x - 13,
      top: shape.y - 13,
    });

    canvas.insertAt(circle, 1, false);
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