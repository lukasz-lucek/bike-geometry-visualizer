import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { ColorPoint2d } from '../../interfaces/Point2d';

export function PointMarker({ shape, layer=1 }: { shape: ColorPoint2d, layer?: number}) {
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

    canvas.addObjectToLayer(circle, layer);
    canvas.renderAll();

    return () => {
      //TODO - problematic if canvas is destroyed before this component
      canvas.removeObjectFromAnyLayer(circle);
      //canvas.renderAll();
    }

  }, [shape, canvasState.canvas, layer]);

  return (
    <>
    </>
  );
}

export default PointMarker;