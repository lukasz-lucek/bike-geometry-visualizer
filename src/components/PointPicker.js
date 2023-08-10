import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function PointPicker({canvas, pickerColor}) {
  
  useEffect(() => {

    const radius = 10;
    const littleRadius = 1;
    const strokeWidth = 2;
    const littleStrokeWidth = 1;
    const circle = new fabric.Circle({
        radius: radius,
        fill: 'transparent', // Set the fill to transparent
        stroke: pickerColor, // Set the stroke color
        strokeWidth: strokeWidth, // Set the stroke width
        selectable: false,
        evented: false,
        left: canvas.width / 2 - radius,
        top: canvas.height / 2 - radius,
    });

    const point = new fabric.Circle({
        radius: littleRadius,
        fill: pickerColor,
        strokeWidth: littleStrokeWidth,
        selectable: false,
        evented: false,
        stroke: pickerColor,
        left: canvas.width / 2 - littleRadius,
        top: canvas.height / 2 - littleRadius,
    });

    canvas.insertAt(circle, 2);
    canvas.insertAt(point, 3);

    canvas.on("mouse:move", function (e) {
        const coordinates = canvas.getPointer(e);
        const zoom = canvas.getZoom();
        const zoomedRadius = radius / zoom;
        const littleZoomedRadius = littleRadius / zoom;
        circle.left = (coordinates.x - zoomedRadius);
        circle.top = (coordinates.y - zoomedRadius);
        point.left = coordinates.x - littleZoomedRadius;
        point.top = coordinates.y - littleZoomedRadius;
        circle.setRadius(zoomedRadius);
        point.setRadius(littleZoomedRadius);
        canvas.renderAll();
    });

    canvas.hoverCursor = 'pointer';
    canvas.renderAll();

    return () => {
      canvas.hoverCursor = 'default';
      for (var prop in canvas.__eventListeners) {
          if (canvas.__eventListeners.hasOwnProperty(prop) && prop === 'mouse:move') {
              console.log("removing mouse move handler");
              delete canvas.__eventListeners[prop]
          }
      }

      canvas.remove(circle);
      canvas.remove(point);
      
      canvas.renderAll();
    }

  }, [pickerColor, canvas]);

  return (
    <>
    </>
  );
}

export default PointPicker;