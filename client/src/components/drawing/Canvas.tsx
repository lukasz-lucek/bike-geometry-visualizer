import React, { useRef, useEffect, useLayoutEffect } from 'react';
import LayeredCanvas from './LayeredCanvas';
import { useCanvasContext } from '../../contexts/CanvasContext';
import './Canvas.css'; // Import the CSS file

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const {
    state: [fCanvas, updateCanvasState],
  } = useCanvasContext();

  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
const handleResize = () => {
    setDimensions({
    width: window.innerWidth,
    height: window.innerHeight,
    });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  useLayoutEffect(() => {
    
    const div = divRef.current;
    const canvas = canvasRef.current;
    if (!div || !canvas || !fCanvas.canvas) {
      return;
    }
    console.log(`Resizing canvas to: ${div.offsetWidth }, ${div.offsetHeight }`)
    canvas.width = div.scrollWidth ;
    canvas.height = div.scrollWidth ;

    fCanvas.canvas.setWidth(div.offsetWidth );
    fCanvas.canvas.setHeight(div.offsetHeight );
    fCanvas.canvas.renderAll();
  }, [divRef.current, dimensions, fCanvas])

  useEffect(() => {
    console.log("CREATING NEW CANVAS!!!")
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }

    const fabricCanvas = new LayeredCanvas(canvas, {
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

    updateCanvasState({
      canvas: fabricCanvas,
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  

  return (
    <div ref={divRef} className='bike-canvas-div'>
      <canvas ref={canvasRef} className='bike-canvas'/>
    </div>
  );
}