import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import PointMarker from './PointMarker';

export function GeometryPointVisualization() {
  const {
    state: [canvasState, ],
  } = useCanvasContext();

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  const [shapes, setShapes] = useState({});

  useEffect(() => {
    let allShapes = {};
    for (const [geometryPointKey, {x: x, y: y, color: color}] of Object.entries(geometryState.geometryPoints)) {
      allShapes[geometryPointKey] = {shape: {type:"point", x: x, y: y}, color: color};
    }
    setShapes(allShapes);
  }, [geometryState.geometryPoints, canvasState.canvas]);

  return (
    <>
      { Object.keys(shapes).map((key, i) => 
        <PointMarker key={'PointMarker'+i} shape={shapes[key]}/>
      )}
    </>
  );
}

export default GeometryPointVisualization;