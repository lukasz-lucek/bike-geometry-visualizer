// src/components/Workspace.js
import React, { useRef, useEffect, useState} from 'react';
import { fabric } from 'fabric';
import { useCanvasContext } from '../contexts/CanvasContext.js';

const Workspace = ( ) => {
  const {
    addLayer: [, setAddLayerToCanvas],
    enablePointPicker: [, setEnablePointPicker],
    pointSelected: [pointSelectedFunc, ],
    addShapeVisualization: [, setAddShapeVisualization]
  } = useCanvasContext();

  const canvasRef = useRef(null);
  const canvas = useRef(null);

  const defaultState = {
    layers: [],
    pickerEnabled: false,
    pickerColor: "#FFFFFF",
    overlayShapes: {}
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    const newState = {...state, ...newPartialState};
    setState( newState );
  }

  const addNewLayer = (layer) => {
    updateState( {
      "layers": [layer]
    });
  }

  const enablePointPicker = (enabled, color)  => {
    updateState ( {
      pickerEnabled : enabled,
      pickerColor :color
    });
  };

  const addShapeVisualizationFunc = (key, shape, color) => {
    console.log("addShapeVisualizationFunc - trying to visualize: ", key, shape);
    const curKnown = state.overlayShapes;
    if (shape == null) {
      delete curKnown[key];
    } else {
      curKnown[key] = {shape: shape, color: color};
    }
    updateState( {overlayShapes: curKnown});
  }

  const addLayerToCanvas = (layer) => {
    if (layer.type === 'image') {
      
      fabric.Image.fromURL(layer.src, (img) => {
        canvas.current.setZoom(Math.min(canvas.current.width / img.width, canvas.current.height / img.height));
        canvas.current.insertAt(img, 0);
        canvas.current.renderAll();
        canvas.current.selection = false;
        canvas.current.interactive = false;
      });
    }
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
    state.layers.forEach((layer) => addLayerToCanvas(layer));

    for (const [, {shape: shape, color: color}] of Object.entries(state.overlayShapes)) {
      if (shape.type == 'point') {
        const circle = new fabric.Circle({
          radius: 13,
          fill: 'transparent', // Set the fill to transparent
          stroke: color, // Set the stroke color
          strokeWidth: 3, // Set the stroke width
          left: shape.x - 13,
          top: shape.y - 13,
        });

        canvas.current.insertAt(circle, 1);
      } else if (shape.type == 'line') {
        console.log("drwaing a line ", shape)
        const line = new fabric.Line(
          [shape.x1, shape.y1, shape.x2, shape.y2],
          {
          stroke: color, // Set the stroke color
          strokeWidth: 1, // Set the stroke width
        });

        canvas.current.insertAt(line, 2);
      }
      
    }
    canvas.current.renderAll();

    if (state.pickerEnabled) {

      const radius = 10;
      const littleRadius = 1;
      const strokeWidth = 2;
      const littleStrokeWidth = 1;
      const circle = new fabric.Circle({
        radius: radius,
        fill: 'transparent', // Set the fill to transparent
        stroke: state.pickerColor, // Set the stroke color
        strokeWidth: strokeWidth, // Set the stroke width
        left: canvas.current.width / 2 - radius,
        top: canvas.current.height / 2 - radius,
      });
  
      const point = new fabric.Circle({
        radius: littleRadius,
        fill: state.pickerColor,
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
          if (pointSelectedFunc != null) {
            pointSelectedFunc(e.transform.offsetX, e.transform.offsetY);
          }
        }
      });
      canvas.current.hoverCursor = 'pointer';
    } else {
      canvas.current.hoverCursor = 'move';
    }

    setAddLayerToCanvas(() => addNewLayer);
    setEnablePointPicker(() => enablePointPicker);
    setAddShapeVisualization(() => addShapeVisualizationFunc);

    // Clean up event listeners when the component unmounts
    return () => {
      canvas.current.dispose();
      canvas.current = null;
    };
  }, [pointSelectedFunc, state.layers, state.pickerColor, state.pickerEnabled, state.overlayShapes]);
  
  return (
    <div className="workspace">
      <canvas ref={canvasRef} width="1024" height="768" />
    </div>
  );
};

export default Workspace;
