import React, {useEffect, useState, Ref } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { OffsetSpline, SplineDragIndex, SplineDragIndexType, Vec2D } from '../../interfaces/Spline';

const SplineMoveControls = ({spline, updateSpline} : {spline : OffsetSpline, updateSpline : (s:OffsetSpline) => void}) => {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  interface State {
    activeDragIndex: SplineDragIndex;
  }

  const defaultState: State = {
    activeDragIndex: new SplineDragIndex(SplineDragIndexType.NONE, 0)
  }

  const [state, setState] = useState(defaultState);

  const removeMousePickHandlers = () => {
    if (!canvasState.canvas) {
      return;
    }
    let eventListeners: any = (canvasState.canvas as any).__eventListeners;
    for (var prop in eventListeners) {
      if (eventListeners.hasOwnProperty(prop) && (prop === 'mouse:up' || prop === 'mouse:down')) {
        delete eventListeners[prop]
      }
    }
  }

  const removeMouseMovekHandlers = () => {
    if (!canvasState.canvas) {
      return;
    }
    let eventListeners: any = (canvasState.canvas as any).__eventListeners;
    for (var prop in eventListeners) {
      if (eventListeners.hasOwnProperty(prop) && (prop === 'mouse:move')) {
        delete eventListeners[prop]
      }
    }
  }

  useEffect(() => {
    if (!spline || !canvasState.canvas) {
      return;
    }

    canvasState.canvas?.on("mouse:down", function (e) {
      if (!e.transform || !e.transform.offsetX || !e.transform?.offsetY) {
        return;
      }
      const newIndex = spline.getDragOnPosition(new Vec2D(e.transform.offsetX, e.transform.offsetY));
      setState({activeDragIndex : newIndex})
    })

    canvasState.canvas?.on("mouse:up", function (e) {
      const newIndex = new SplineDragIndex(SplineDragIndexType.NONE, 0);
      setState({activeDragIndex : newIndex})
    })

    return () => {
      removeMousePickHandlers();
    }
  }, [spline, canvasState.canvas]);

  useEffect(() => {
    if (!spline || !canvasState.canvas) {
      return;
    }

    canvasState.canvas.on("mouse:move", function (options) {
      if (state.activeDragIndex.type == SplineDragIndexType.NONE) {
        return;
      }

      if (!canvasState.canvas) {
        return;
      }
      
      var p = canvasState.canvas.getPointer(options.e);
      const newSpline = new OffsetSpline(JSON.parse(JSON.stringify(spline)));
      newSpline.reconstruct();
      newSpline.moveDragToPosition(state.activeDragIndex, new Vec2D(p.x, p.y))
      
      updateSpline(newSpline);
    })
    return () => {
      removeMouseMovekHandlers();
    }
  }, [spline, canvasState.canvas, state.activeDragIndex]);

  return (
    <>
    </>
  );
};

export default SplineMoveControls;
