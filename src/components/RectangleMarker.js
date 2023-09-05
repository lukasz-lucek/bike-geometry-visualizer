import React, { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import RectangleGrabVisualization from './RectangleGrabVisualization.js';
import {findRectangle} from '../utils/GeometryUtils.js'

export function RectangleMarker({canvas, shape, imageSrc}) {

  const rectangle = useMemo(() => {
    const sh = shape.shape;
    const rectangle = findRectangle({x1: sh.x1, y1: sh.y1},{x2: sh.x2, y2: sh.y2},sh.width);
    rectangle.fill = 'transparent';
    rectangle.stroke = 'red';
    rectangle.strokeWidth = sh.strokeWidth;
    
    // const center = {
    //     x: (sh.x1 + sh.x2) / 2, 
    //     y: (sh.y1 + sh.y2) / 2
    // }
    // const width = sh.width;
    // const length = Math.sqrt(Math.pow(sh.x1-sh.x2,2) + Math.pow(sh.y1-sh.y2,2));
    // const angle = Math.atan2(sh.y2-sh.y1, sh.x2-sh.x1) * 180 / Math.PI;

    // const rectangle = new fabric.Rect({
    //     left: center.x - length/2,
    //     top: center.y - width/2,
    //     fill: 'transparent',
    //     stroke: 'red',
    //     strokeWidth: sh.strokeWidth,
    //     width: length,
    //     height: width,
    // });

    return rectangle;
  }, [shape, canvas]);
  
  useEffect(() => {
    canvas.insertAt(rectangle, 2);

    canvas.renderAll();

    return () => {
      canvas.remove(rectangle);
      canvas.renderAll();
    }

  }, [shape, canvas, imageSrc]);

  return (
    <>
      <RectangleGrabVisualization canvas={canvas} rectangle={rectangle} shape={shape} imageSrc={imageSrc}/>
    </>
  );
}

export default RectangleMarker;