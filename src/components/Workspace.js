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
    pickerColor: "#FFFFFF",
    knownPoints: {}
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

  const enablePointPicker = (enabled, color)  => {
    console.log("enablePointPicker: ", enabled);
    setInnerState ( {...innerState,["pickerEnabled"]: enabled,["pickerColor"]:color});
  };

  const addNewKnownPoint = (key, x, y) => {
    const curKnown = innerState.knownPoints;
    if (curKnown[key] == null) {
      curKnown[key] = {x: x, y: y};
    } else {
      curKnown[key].x = x;
      curKnown[key].y = y;
    }
    setInnerState( {...innerState,["knownPoints"]: curKnown});
  };

  const addLayerToCanvas = (layer) => {
    if (layer.type === 'image') {
      fabric.Image.fromURL(layer.src, (img) => {
        canvas.current.setZoom(Math.min(canvas.current.width / img.width, canvas.current.height / img.height));
        //img.lockMovementX = true;
        //img.lockMovementY = true;
        canvas.current.insertAt(img, 0);
        canvas.current.renderAll();
        canvas.current.selection = false;
        canvas.current.interactive = false;
      });
    }
    // Add more layer types (e.g., text, shapes) here if needed
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

    for (const [colorKey, knownPoint] of Object.entries(innerState.knownPoints)) {
      const circle = new fabric.Circle({
        radius: 13,
        fill: 'transparent', // Set the fill to transparent
        stroke: colorKey, // Set the stroke color
        strokeWidth: 3, // Set the stroke width
        left: knownPoint.x - 13,
        top: knownPoint.y - 13,
      });
      canvas.current.insertAt(circle, 1);
      canvas.current.renderAll();
    }

    if (innerState.pickerEnabled) {

      const radius = 10;
      const littleRadius = 1;
      const strokeWidth = 2;
      const littleStrokeWidth = 1;
      const circle = new fabric.Circle({
        radius: radius,
        fill: 'transparent', // Set the fill to transparent
        stroke: innerState.pickerColor, // Set the stroke color
        strokeWidth: strokeWidth, // Set the stroke width
        left: canvas.current.width / 2 - radius,
        top: canvas.current.height / 2 - radius,
      });
  
      const point = new fabric.Circle({
        radius: littleRadius,
        fill: innerState.pickerColor,
        left: canvas.current.width / 2 - littleRadius,
        top: canvas.current.height / 2 - littleRadius,
      });

      canvas.current.insertAt(circle, 1);
      canvas.current.insertAt(point, 1);
      
      canvas.current.renderAll();
      

      canvas.current.on("mouse:move", function (e) {
        const coordinates = canvas.current.getPointer(e);
        const zoom = canvas.current.getZoom();
        const zoomedRadius = radius / zoom;
        const littleZoomedRadius = littleRadius / zoom;
        console.log(coordinates.x, coordinates.y);
        circle.left = (coordinates.x - zoomedRadius);
        circle.top = (coordinates.y - zoomedRadius);
        point.left = coordinates.x - littleZoomedRadius;
        point.top = coordinates.y - littleZoomedRadius;
        circle.setRadius(zoomedRadius);
        point.setRadius(littleZoomedRadius);
        canvas.current.renderAll();
      });

      canvas.current.on("mouse:up", function (e) {
        if (e.isClick && e.target != null) {
          console.log("x = ", e.transform.offsetX, " y = ", e.transform.offsetY);
          if (pointSelectedFunc != null) {
            pointSelectedFunc(e.transform.offsetX, e.transform.offsetY);
            addNewKnownPoint(innerState.pickerColor, e.transform.offsetX, e.transform.offsetY);
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
