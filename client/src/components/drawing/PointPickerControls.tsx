// src/components/Visualizer.js
import { rejects } from 'assert';
import Color from 'color';
import React, { forwardRef, useImperativeHandle, useEffect, useState, Ref } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Point2d } from '../../interfaces/Point2d';
import PointPicker from "./PointPicker"

export interface PointPickerControlsRef {
  enablePointPicker: (color: Color) => Promise<Point2d>;
}

const PointPickerControls = forwardRef(({ }, ref: Ref<PointPickerControlsRef>) => {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  interface State {
    pickerEnabled: boolean;
    pickerColor: Color
  }

  const defaultState: State = {
    pickerEnabled: false,
    pickerColor: Color("#FFFFFF"),
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState: Partial<State>) => {
    const newState = { ...state, ...newPartialState };
    setState(newState);
  }

  const removeMouseUpHandlers = () => {
    if (!canvasState.canvas) {
      return;
    }
    let eventListeners: any = (canvasState.canvas as any).__eventListeners;
    for (var prop in eventListeners) {
      if (eventListeners.hasOwnProperty(prop) && prop === 'mouse:up') {
        delete eventListeners[prop]
      }
    }
  }

  useImperativeHandle(ref, () => ({
    enablePointPicker(color: Color) {
      return new Promise((resolve, reject) => {
        canvasState.canvas?.on("mouse:up", function (e) {
          if (e.isClick && e.target != null) {
            if (!e.transform || !e.transform.offsetX || !e.transform?.offsetY) {
              reject();
            } else {
              resolve(
                {
                  x: e.transform?.offsetX,
                  y: e.transform?.offsetY
                }
              );
            }
            updateState({
              pickerEnabled: false,
            });
          }
        });
        updateState({
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
    if (canvasState.canvas) {
      canvasState.canvas.renderAll();
    }
  }, [state.pickerEnabled, canvasState.canvas]);

  return (
    <>
      {state.pickerEnabled ? <PointPicker pickerColor={state.pickerColor} /> : null}
    </>
  );
});

export default PointPickerControls;
