// src/components/Visualizer.js
import React, { forwardRef, useImperativeHandle, useEffect, useState} from 'react';
import PointPicker from "./PointPicker.js"

const PointPickerControls = forwardRef(({canvas}, ref) => {
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
          delete canvas.__eventListeners[prop]
      }
    }
  }

  useImperativeHandle(ref, () => ({
    enablePointPicker (color) {
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
  }));

  useEffect(() => {
    if (!state.pickerEnabled) {
      removeMouseUpHandlers();
    }
    canvas.renderAll();
  }, [state.pickerEnabled, canvas]);
  
  return (
    <div className="visualizer">
      {state.pickerEnabled ? <PointPicker canvas={canvas} pickerColor={state.pickerColor}/> : null}
    </div>
  );
});

export default PointPickerControls;
