import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

export function Canvas({setCanvas, children}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log("CREATING NEW CANVAS!!!")
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      interactive: false, // Disable editing and selection
      selection: false,
    });
    fabricCanvas.selection = false;
    fabricCanvas.on('mouse:wheel', function(opt) {
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
    setCanvas(fabricCanvas);

    return () => {
        fabricCanvas.dispose();
    };
  }, [setCanvas]);

  return (
    <>
        <canvas ref={canvasRef} width="1024" height="768"/>
        {children}
    </>
  );
}