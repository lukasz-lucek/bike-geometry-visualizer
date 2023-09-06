import React, { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
// import RectangleGrabVisualization from './RectangleGrabVisualization.js';

export function CircleMarker({canvas, shape, imageSrc}) {
  
  useEffect(() => {
    const sh = shape.shape;
    const circle = new fabric.Circle({
      left: sh.x - sh.radius, // Adjust left position based on the center and radius
      top: sh.y - sh.radius, // Adjust top position based on the center and radius
      radius: sh.radius,
      fill: 'transparent', // Circle fill color
      stroke: 'red', // Circle border color
      strokeWidth: sh.strokeWidth, // Border width (optional)
    });
    canvas.insertAt(circle, 2);

    canvas.renderAll();

    return () => {
      canvas.remove(circle);
      canvas.renderAll();
    }

  }, [shape, canvas, imageSrc]);

  return (
    <>
      {/* <RectangleGrabVisualization canvas={canvas} rectangle={rectangle} shape={shape} imageSrc={imageSrc}/> */}
    </>
  );
}

export default CircleMarker;