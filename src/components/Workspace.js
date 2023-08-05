// src/components/Workspace.js
import React, { useRef, useEffect, useState} from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../contexts/CanvasContext.js';

const Workspace = ( ) => {
  const canvasRef = useRef(null);
  const canvas = useRef(null);
  const [innerState, setInnerState] = useState({
    layers: [],
    pickerEnabled: false,
    pickerColor: "#FFFFFF"
  });

  const {
    addLayer: [, setAddLayerToCanvas],
    enablePointPicker: [, setEnablePointPicker],
    pointSelected: [pointSelectedFunc, ]
  } = useCanvasContext();

  const addNewLayer = (layer) => {
    const newLayers = innerState.layers.concat(layer);
    console.log("layers: ", newLayers);
    setInnerState( {...innerState,["layers"]: newLayers});
  }

  const addLayerToCanvas = (layer) => {
    if (layer.type === 'image') {
      fabric.Image.fromURL(layer.src, (img) => {
        //img.lockMovementX = true;
        //img.lockMovementY = true;
        canvas.current.add(img);
        canvas.current.renderAll();
        canvas.current.selection = false;
        canvas.current.interactive = false;
      });
    }
    // Add more layer types (e.g., text, shapes) here if needed
  };

  const enablePointPicker = (enabled, color)  => {
    console.log("enablePointPicker: ", enabled);
    setInnerState( {...innerState,["pickerEnabled"]: enabled});
  };

  useEffect(() => {
    // Initialize the fabric.js canvas when the component mounts
    canvas.current = new fabric.Canvas(canvasRef.current, {
      interactive: false, // Disable editing and selection
      selection: false,
    });

    // Disable selection of objects on the canvas
    canvas.current.selection = false;



    canvas.current.on('mouse:wheel', function(opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.current.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.current.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = this.viewportTransform;
      
    })

    // Load initial layers to the canvas
    innerState.layers.forEach((layer) => addLayerToCanvas(layer));

    if (innerState.pickerEnabled) {
      canvas.current.on("mouse:up", function (e) {
        if (e.isClick && e.target != null) {
          console.log("x = ", e.transform.offsetX, " y = ", e.transform.offsetY);
          if (pointSelectedFunc != null) {
            pointSelectedFunc(e.transform.offsetX, e.transform.offsetY);
          } else {
            console.log("point selected func is null");
          }
        }
      });
      console.log("enabling pointer");
      canvas.current.hoverCursor = 'pointer';
    } else {
      console.log("disabling pointer");
      canvas.current.hoverCursor = 'move';
    }

    setAddLayerToCanvas(() => addNewLayer);
    setEnablePointPicker(() => enablePointPicker);

    // Clean up event listeners when the component unmounts
    return () => {
      canvas.current.dispose();
      canvas.current = null;
    };
  }, [pointSelectedFunc, innerState.layers, innerState.pickerColor, innerState.pickerEnabled]);
  
  return (
    <div className="workspace">
      <canvas ref={canvasRef} width="1024" height="768" />
    </div>
  );
};

export default Workspace;
