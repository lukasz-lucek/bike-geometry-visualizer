import React, { useEffect } from 'react';
import { OffsetSpline } from '../../interfaces/Spline';
import { useCanvasContext } from '../../contexts/CanvasContext';

export function SplineVisualization({ spline, drawControlPoints }: { spline: OffsetSpline, drawControlPoints: boolean }) {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas) {
      return;
    }

    spline.drawToCanvas(canvas,drawControlPoints);

    return () => {
      spline.removeFromCanvas(canvas);
    }
  }, [spline, canvasState.canvas, drawControlPoints]);

  return (
    <>
      
    </>
  );
}

export default SplineVisualization;