import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function LineMarker({canvas, shape}) {
  
  useEffect(() => {
console.log("stroke width: ", Math.ceil(shape.shape.strokeWidth));
    const line = new fabric.Line(
      [shape.shape.x1, shape.shape.y1, shape.shape.x2, shape.shape.y2],
      {
      stroke: shape.color, // Set the stroke color
      strokeWidth: Math.ceil(shape.shape.strokeWidth), // Set the stroke width
      selectable: false,
      evented: false,

    });

    canvas.insertAt(line, 2);

    canvas.renderAll();

    return () => {
      canvas.remove(line);
      canvas.renderAll();
    }

  }, [shape, canvas]);

  return (
    <>
    </>
  );
}

export default LineMarker;