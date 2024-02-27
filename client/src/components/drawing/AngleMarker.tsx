import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../../contexts/CanvasContext';
import Color from 'color';

export interface Angle {
  strokeWidth: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  color: Color,
}


export function AngleMarker({ angle }: { angle: Angle }) {
  const {
    state: [canvasState,],
  } = useCanvasContext();

  useEffect(() => {
    const canvas = canvasState.canvas;
    const line1 = new fabric.Line(
      [angle.x1, angle.y1, angle.x2, angle.y2],
      {
        stroke: angle.color.toString(), // Set the stroke color
        strokeWidth: angle.strokeWidth, // Set the stroke width
        selectable: false,
        evented: false,
      });

    canvas?.insertAt(line1, 2, false);

    const line2 = new fabric.Line(
      [angle.x2, angle.y2, angle.x3, angle.y3],
      {
        stroke: angle.color.toString(), // Set the stroke color
        strokeWidth: angle.strokeWidth, // Set the stroke width
        selectable: false,
        evented: false,

      });

    canvas?.insertAt(line2, 2, false);

    const startAngle = Math.atan2(angle.y1 - angle.y2, angle.x1 - angle.x2) * 180 / Math.PI;
    const endAngle = Math.atan2(angle.y3 - angle.y1, angle.x3 - angle.x2) * 180 / Math.PI;

    const circle = new fabric.Circle({
      radius: 50,
      left: angle.x2 - 50,
      top: angle.y2 - 50,
      startAngle: startAngle,
      endAngle: endAngle,
      stroke: angle.color.toString(),
      strokeWidth: angle.strokeWidth,
      fill: 'transparent',
      selectable: false,
      evented: false,
    });
    canvas?.insertAt(circle, 2, false);

    canvas?.renderAll();

    return () => {
      canvas?.remove(line1);
      canvas?.remove(line2);
      canvas?.remove(circle);
      canvas?.renderAll();
    }

  }, [angle, canvasState.canvas]);

  return (
    <>
    </>
  );
}

export default AngleMarker;