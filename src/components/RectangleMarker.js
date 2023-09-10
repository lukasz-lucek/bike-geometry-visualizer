import React, { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import RectangleGrabVisualization from './RectangleGrabVisualization.js';
import {findRectangle} from '../utils/GeometryUtils.js'

export function RectangleMarker({canvas, shape}) {

  const rectangle = useMemo(() => {
    const sh = shape.shape;
    const rectangle = findRectangle({x1: sh.x1, y1: sh.y1},{x2: sh.x2, y2: sh.y2},sh.width);
    rectangle.fill = 'transparent';
    rectangle.stroke = shape.color;
    rectangle.strokeWidth = sh.strokeWidth;

    return rectangle;
  }, [shape, canvas]);
  
  useEffect(() => {
    canvas.insertAt(rectangle, 2);

    canvas.renderAll();

    return () => {
      canvas.remove(rectangle);
      canvas.renderAll();
    }

  }, [shape, canvas]);

  return (
    <>
      <RectangleGrabVisualization canvas={canvas} shape={shape}/>
    </>
  );
}

export default RectangleMarker;