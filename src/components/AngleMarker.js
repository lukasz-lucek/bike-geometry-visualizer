import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../contexts/CanvasContext';

export function AngleMarker({shape}) {
  const {
    state: [canvasState, ],
  } = useCanvasContext();
  
  useEffect(() => {
    const canvas = canvasState.canvas;
    const line1 = new fabric.Line(
      [shape.shape.x1, shape.shape.y1, shape.shape.x2, shape.shape.y2],
      {
      stroke: shape.color, // Set the stroke color
      strokeWidth: shape.shape.strokeWidth, // Set the stroke width
      selectable: false,
      evented: false,

    });

    canvas.insertAt(line1, 2);

    const line2 = new fabric.Line(
      [shape.shape.x2, shape.shape.y2, shape.shape.x3, shape.shape.y3],
      {
      stroke: shape.color, // Set the stroke color
      strokeWidth: shape.shape.strokeWidth, // Set the stroke width
      selectable: false,
      evented: false,

    });

    canvas.insertAt(line2, 2);

    const startAngle = Math.atan2(shape.shape.y1-shape.shape.y2, shape.shape.x1-shape.shape.x2) * 180 / Math.PI;
    const endAngle =  Math.atan2(shape.shape.y3-shape.shape.y1, shape.shape.x3-shape.shape.x2) * 180 / Math.PI;

    const circle = new fabric.Circle({
      radius: 50,
      left: shape.shape.x2 - 50,
      top: shape.shape.y2 - 50,
      startAngle: startAngle,
      endAngle: endAngle,
      stroke: shape.color,
      strokeWidth: shape.shape.strokeWidth,
      fill: 'transparent',
      selectable: false,
      evented: false,
    });
    canvas.insertAt(circle, 2);

    // const circle2 = new fabric.Circle({
    //   radius: 13,
    //   fill: 'transparent', // Set the fill to transparent
    //   stroke: shape.color, // Set the stroke color
    //   strokeWidth: 3, // Set the stroke width
    //   selectable: false,
    //   evented: false,
    //   left: shape.shape.x - 13,
    //   top: shape.shape.y - 13,
    // });

    canvas.renderAll();

    return () => {
      canvas.remove(line1);
      canvas.remove(line2);
      canvas.remove(circle);
      canvas.renderAll();
    }

  }, [shape, canvasState.canvas]);

  return (
    <>
    </>
  );
}

export default AngleMarker;