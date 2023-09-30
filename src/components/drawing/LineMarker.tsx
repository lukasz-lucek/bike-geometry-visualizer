import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Point2d } from '../../interfaces/Point2d';
import Color from 'color';

export interface Line {
  strokeWidth: number,
  p1: Point2d,
  p2: Point2d,
  color: Color,
}

export function LineMarker({line} : {line: Line}) {
  const {
    state: [canvasState, ],
  } = useCanvasContext();
  
  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas) {
      return;
    }
    const fabricLine = new fabric.Line(
      [line.p1.x, line.p1.y, line.p2.x, line.p2.y],
      {
      stroke: line.color.toString(), // Set the stroke color
      strokeWidth: Math.ceil(line.strokeWidth), // Set the stroke width
      selectable: false,
      evented: false,
    });

    canvas.insertAt(fabricLine, 2, false);
    canvas.renderAll();

    return () => {
      canvas.remove(fabricLine);
      canvas.renderAll();
    }

  }, [line, canvasState.canvas]);

  return (
    <>
    </>
  );
}

export default LineMarker;