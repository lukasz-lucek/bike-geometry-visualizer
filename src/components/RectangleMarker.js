import React, { useState, useEffect, useMemo } from 'react';
import RectangleGrabVisualization from './RectangleGrabVisualization.js';
import {findRectangle} from '../utils/GeometryUtils'

export function RectangleMarker({canvas, shape, leftPlacementPoint=null, rightPlacementPoint=null, layer=3, scaling=1}) {

  const rectangle = useMemo(() => {
    const sh = shape.shape;
    const rectangle = findRectangle({x: sh.x1, y: sh.y1},{x: sh.x2, y: sh.y2},sh.width);
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
      <RectangleGrabVisualization
        canvas={canvas}
        shape={shape}
        leftPlacementPoint={leftPlacementPoint}
        rightPlacementPoint={rightPlacementPoint}
        layer={layer}
        scaling={scaling}/>
    </>
  );
}

export default RectangleMarker;