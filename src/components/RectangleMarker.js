import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function RectangleMarker({canvas, shape}) {
  
  useEffect(() => {
    const sh = shape.shape;
    const center = {
        x: (sh.x1 + sh.x2) / 2, 
        y: (sh.y1 + sh.y2) / 2
    }
    const width = sh.width;
    const length = Math.sqrt(Math.pow(sh.x1-sh.x2,2) + Math.pow(sh.y1-sh.y2,2));
    const angle = Math.atan2(sh.y2-sh.y1, sh.x2-sh.x1) * 180 / Math.PI;

    const rectangle = new fabric.Rect({
        left: center.x - length/2,
        top: center.y - width/2,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: sh.strokeWidth,
        width: length,
        height: width,
    });

    rectangle.rotate(angle);

    canvas.insertAt(rectangle, 2);

    canvas.renderAll();

    return () => {
      canvas.remove(rectangle);
      canvas.renderAll();
    }

  }, [shape, canvas]);

  return (
    <>
    </>
  );
}

export default RectangleMarker;