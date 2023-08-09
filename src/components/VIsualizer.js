// src/components/Visualizer.js
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState} from 'react';
import { fabric } from 'fabric';

const Visualizer = forwardRef(({canvas}, ref) => {
  const defaultState = {
    layers: [],
    pickerEnabled: false,
    pickerColor: "#FFFFFF",
    overlayShapes: {},
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    const newState = {...state, ...newPartialState};
    setState( newState );
  }

  useImperativeHandle(ref, () => ({
    addNewLayer (layer) {
        console.log("Visualizer.addNewLayer");
        updateState( {
            layers: [layer]
        });
    },

    enablePointPicker (color) {
        console.log("starting point selection");
        return new Promise( (resolve, reject) => {
            const radius = 10;
            const littleRadius = 1;
            const strokeWidth = 2;
            const littleStrokeWidth = 1;
            const circle = new fabric.Circle({
                radius: radius,
                fill: 'transparent', // Set the fill to transparent
                stroke: color, // Set the stroke color
                strokeWidth: strokeWidth, // Set the stroke width
                left: canvas.width / 2 - radius,
                top: canvas.height / 2 - radius,
            });
        
            const point = new fabric.Circle({
                radius: littleRadius,
                fill: color,
                left: canvas.width / 2 - littleRadius,
                top: canvas.height / 2 - littleRadius,
            });
    
            canvas.insertAt(circle, 1);
            canvas.insertAt(point, 1);
            
            canvas.renderAll();
            
    
            canvas.on("mouse:move", function (e) {
                const coordinates = canvas.getPointer(e);
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
    
            canvas.on("mouse:up", function (e) {
            if (e.isClick && e.target != null) {
                resolve(
                    {x: e.transform.offsetX, 
                     y: e.transform.offsetY
                    }
                );
                // if (pointSelectedFunc != null) {
                //   pointSelectedFunc(e.transform.offsetX, e.transform.offsetY);
                // }
            }
            });
            canvas.hoverCursor = 'pointer';
        });
    },

    disablePointPicker () {
        updateState ( {
            pickerEnabled : false,
        });
    },

    addShapeVisualizationFunc (key, shape, color) {
        console.log("Visualizer.addShapeVisualizationFunc");
        const curKnown = state.overlayShapes;
        if (shape == null) {
          delete curKnown[key];
        } else {
          curKnown[key] = {shape: shape, color: color};
        }
        updateState( {overlayShapes: curKnown});
      }
  }));

  const addLayerToCanvas = (layer) => {
    if (layer.type === 'image') {
      
      fabric.Image.fromURL(layer.src, (img) => {
        canvas.setZoom(Math.min(canvas.width / img.width, canvas.height / img.height));
        canvas.insertAt(img, 0);
        canvas.renderAll();
        canvas.selection = false;
        canvas.interactive = false;
      });
    }
  };

  useEffect(() => {
    // remove all objects, before rendering new ones
    canvas.remove(...canvas.getObjects());
    //reset zooming
    canvas.setViewportTransform([1,0,0,1,0,0]); 
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

        canvas.insertAt(circle, 1);
      } else if (shape.type == 'line') {
        const line = new fabric.Line(
          [shape.x1, shape.y1, shape.x2, shape.y2],
          {
          stroke: color, // Set the stroke color
          strokeWidth: 3, // Set the stroke width
        });

        canvas.insertAt(line, 2);
      }
      
    }
    canvas.renderAll();
  }, [state, canvas]);
  
  return (
    <div className="visualizer">
    </div>
  );
});

export default Visualizer;
