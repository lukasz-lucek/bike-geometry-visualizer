import React, { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import WheelGrabVisualization from './WheelGrabVisualization.js';

export function CircleMarker({canvas, shape, placementPoint=null, scale=1, layer=3}) {
  
  useEffect(() => {
    const sh = shape.shape;
    // if (sh.startAngle && sh.endAngle) {
      const circle = new fabric.Circle({
        left: sh.x - sh.radius,
        top: sh.y - sh.radius,
        radius: sh.radius,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: sh.strokeWidth,
        startAngle: sh.startAngle,
        endAngle: sh.endAngle
      });
      canvas.insertAt(circle, 2);
    // } else {
    //   const circle = new fabric.Circle({
    //     left: sh.x - sh.radius,
    //     top: sh.y - sh.radius,
    //     radius: sh.radius,
    //     fill: 'transparent',
    //     stroke: 'red',
    //     strokeWidth: sh.strokeWidth,
    //   });
    //   canvas.insertAt(circle, 2);
    // }

    canvas.renderAll();

    return () => {
      canvas.remove(circle);
      canvas.renderAll();
    }

  }, [shape, canvas]);

  return (
    <>
      <WheelGrabVisualization
        canvas={canvas}
        shape={shape}
        placementPoint={placementPoint}
        scale={scale}
        layer={layer}/>
    </>
  );
}

export default CircleMarker;