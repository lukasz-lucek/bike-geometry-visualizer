// src/components/Visualizer.js
import React, { forwardRef, useImperativeHandle, useEffect, useState} from 'react';
import PointPicker from "../components/PointPicker.js"

const Visualizer = forwardRef(({canvas}, ref) => {
  const defaultState = {
    layers: [],
    pickerEnabled: false,
    pickerColor: "#FFFFFF",
    overlayShapes: {},
    angleOfRotation: 0,
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    const newState = {...state, ...newPartialState};
    setState( newState );
  }

  const removeMouseUpHandlers = () => {
    for (var prop in canvas.__eventListeners) {
      if (canvas.__eventListeners.hasOwnProperty(prop) && prop === 'mouse:up') {
          console.log("removing mouse up handler");
          delete canvas.__eventListeners[prop]
      }
    }
  }

  useImperativeHandle(ref, () => ({
    addNewLayer (layer) {
        if (state.layers[0] && layer.src == state.layers[0].src) {
          console.log("same image - no need to cahnge layer");
          return;
        }
        console.log("Visualizer.addNewLayer");
        updateState( {
            layers: [layer]
        });
    },

    disablePointPicker () {
        updateState ( {
            pickerEnabled : false,
        });
    },

    

    enablePointPicker (color) {
      console.log("starting point selection");
      return new Promise( (resolve, ) => {
          canvas.on("mouse:up", function (e) {
          if (e.isClick && e.target != null) {
              resolve(
                  {x: e.transform.offsetX, 
                    y: e.transform.offsetY
                  }
              );
              updateState ( {
                  pickerEnabled : false,
              });
          }
          });
          updateState( {
              pickerColor: color,
              pickerEnabled: true
          })
          
      });
    },

    addShapeVisualizationFunc (key, shape, color) {
      const curKnown = state.overlayShapes;
      if (shape == null) {
        delete curKnown[key];
      } else {
        curKnown[key] = {shape: shape, color: color};
      }
      updateState( {overlayShapes: curKnown});
    },

    fixRotationFunc(angle) {
      console.log("Fixing rotation");
      updateState({angleOfRotation: angle});
    }
  }));

  useEffect(() => {
    if (!state.pickerEnabled) {
      removeMouseUpHandlers();
    }
    canvas.renderAll();
  }, [state, canvas]);
  
  return (
    <div className="visualizer">
      {state.pickerEnabled ? <PointPicker canvas={canvas} pickerColor={state.pickerColor}/> : null}
    </div>
  );
});

export default Visualizer;
