import React, {useEffect, useState } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Polygon } from '../../interfaces/Polygon';
import { fabric } from 'fabric';
import { Point2d } from '../../interfaces/Point2d';

const PolygonAppendControls = ({polygon, updatePolygon} : {polygon : Polygon, updatePolygon : (p:Polygon) => void}) => {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const [pointMarker, setPointMarker] = useState<fabric.Rect | null>(null);
  const [lineMarker, setLineMarker] = useState<fabric.Line | null>(null);
  const [lineEndMarker, setLineEndMarker] = useState<fabric.Line | null>(null);

  const removeMouseHandlers = () => {
    if (!canvasState.canvas) {
      return;
    }
    let eventListeners: any = (canvasState.canvas as any).__eventListeners;
    for (var prop in eventListeners) {
      if (eventListeners.hasOwnProperty(prop) && (prop === 'mouse:move' || prop === 'mouse:up')) {
        delete eventListeners[prop]
      }
    }
  }

  const mouseMoveHandler = (options : fabric.IEvent<MouseEvent>) => {
    const canvas = canvasState.canvas;
    if (!canvas) {
      return;
    }

    var p = canvas.getPointer(options.e);
    if (!pointMarker) {
      const rect = new fabric.Rect({top: p.y-1, left: p.x-1, width: 3, height: 3, fill: "red"})
      setPointMarker(rect)
    } else {
      pointMarker.top = p.y-1;
      pointMarker.left = p.x-1;
      canvas.renderAll();
    }

    const lastPoint = polygon.vertices.length > 0 ? polygon.vertices[polygon.vertices.length-1] : undefined;
    const firstPoint = polygon.vertices.length > 1 ? polygon.vertices[0] : undefined
    if (lastPoint) {
      if (!lineMarker) {
        const line = new fabric.Line([lastPoint.x, lastPoint.y, p.x, p.y], {stroke: 'blue', width: 1})
        setLineMarker(line);
      } else {
        lineMarker.set({
          x1 : lastPoint.x,
          y1 : lastPoint.y,
          x2 : p.x,
          y2 : p.y,
        })
        canvas.renderAll();
      }
    }
    if (firstPoint) {
      if (!lineEndMarker) {
        const line = new fabric.Line([firstPoint.x, firstPoint.y, p.x, p.y], {stroke: 'blue', width: 1})
        setLineEndMarker(line);
      } else {
        lineEndMarker.set({
          x1 : firstPoint.x,
          y1 : firstPoint.y,
          x2 : p.x,
          y2 : p.y,
        })
        canvas.renderAll();
      }
    }
  }

  const mouseClickHandler = (options : fabric.IEvent<MouseEvent>) => {
    const canvas = canvasState.canvas;
    if (!canvas) {
      return;
    }

    const p = canvas.getPointer(options.e);
    const newVertice: Point2d = {
      x: p.x,
      y: p.y,
    }
    const polygonUpdated : Polygon = {
      vertices : [...polygon.vertices, newVertice]
    }
    updatePolygon(polygonUpdated);
  }

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!polygon || !canvas) {
      return;
    }

    canvas.on("mouse:move", mouseMoveHandler)
    canvas.on("mouse:up", mouseClickHandler)

    const fabricPolygon = new fabric.Polygon(polygon.vertices, {fill: 'red', opacity: 0.5});
    canvas.addObjectToLayer(fabricPolygon, 9);
    canvas.renderAll();
    return () => {
      removeMouseHandlers();
      canvas.removeObjectFromAnyLayer(fabricPolygon);
      canvas.renderAll();
    }
  }, [polygon, canvasState.canvas]);

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas || !lineMarker) {
      return;
    }
    canvas.addObjectToLayer(lineMarker, 10);
    canvas.renderAll();
    return () => {
      if (canvas) {
        if (lineMarker) {
          canvas.removeObjectFromAnyLayer(lineMarker);
          canvas.renderAll();
        }
      }
    }
  }, [lineMarker]);

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas || !lineEndMarker) {
      return;
    }
    canvas.addObjectToLayer(lineEndMarker, 10);
    canvas.renderAll();
    return () => {
      if (canvas) {
        if (lineEndMarker) {
          canvas.removeObjectFromAnyLayer(lineEndMarker);
          canvas.renderAll();
        }
      }
    }
  }, [lineEndMarker]);

  useEffect(() => {
    const canvas = canvasState.canvas;
    if (!canvas || !pointMarker) {
      return;
    }
    canvas.addObjectToLayer(pointMarker, 10);
    canvas.renderAll();
    return () => {
      if (canvas) {
        if (pointMarker) {
          canvas.removeObjectFromAnyLayer(pointMarker);
          canvas.renderAll();
        }
      }
    }
  }, [pointMarker]);

  return (
    <>
    </>
  );
};

export default PolygonAppendControls;
