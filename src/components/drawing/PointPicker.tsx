import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import Color from 'color';
import { useCanvasContext } from '../../contexts/CanvasContext';

export function PointPicker({ pickerColor }: { pickerColor: Color }) {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  useEffect(() => {

    const canvas = canvasState.canvas;
    if (!canvas) {
      return;
    }

    const radius = 10;
    const littleRadius = 1;
    const strokeWidth = 2;
    const littleStrokeWidth = 1;
    const circle = new fabric.Circle({
      radius: radius,
      fill: 'transparent', // Set the fill to transparent
      stroke: pickerColor.toString(), // Set the stroke color
      strokeWidth: strokeWidth, // Set the stroke width
      selectable: false,
      evented: false,
      left: (canvas.width ? canvas.width : 0) / 2 - radius,
      top: (canvas.height ? canvas.height : 0) / 2 - radius,
    });

    const point = new fabric.Circle({
      radius: littleRadius,
      fill: pickerColor.toString(),
      strokeWidth: littleStrokeWidth,
      selectable: false,
      evented: false,
      stroke: pickerColor.toString(),
      left: (canvas.width ? canvas.width : 0) / 2 - littleRadius,
      top: (canvas.height ? canvas.height : 0) / 2 - littleRadius,
    });

    canvas.insertAt(circle, 2, false);
    canvas.insertAt(point, 3, false);

    canvas.on("mouse:move", function (e) {
      const coordinates = canvas.getPointer(e.e);
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

      //fix for listeners not registering out
      let eventListeners: any = (canvas as any).__eventListeners;
      for (var prop in eventListeners) {
        if (eventListeners.hasOwnProperty(prop) && prop === 'mouse:move') {
          delete eventListeners[prop]
        }
      }

      canvas.remove(circle);
      canvas.remove(point);

      canvas.renderAll();
    }

  }, [pickerColor, canvasState.canvas]);

  return (
    <>
    </>
  );
}

export default PointPicker;