import React, { useRef, useEffect } from 'react';
import LayeredCanvas from './LayeredCanvas';
import { useCanvasContext } from '../../contexts/CanvasContext';

export function Canvas() {
  const canvasRef = useRef(null);

  const {
    state: [, updateCanvasState],
  } = useCanvasContext();

  useEffect(() => {
    console.log("CREATING NEW CANVAS!!!")
    const fabricCanvas = new LayeredCanvas(canvasRef.current, {
      interactive: false, // Disable editing and selection
      selection: false,
      preserveObjectStacking: true,
    });
    fabricCanvas.selection = false;
    fabricCanvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = fabricCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      fabricCanvas.renderAll();
    })
    fabricCanvas.renderAll();

    updateCanvasState({
      canvas: fabricCanvas,
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width="1200" height="920" />
    </>
  );
}