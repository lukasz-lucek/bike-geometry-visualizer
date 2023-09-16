import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import PointMarker from './PointMarker';

export function GeometryPointVisualization({pointsSet}) {
  const {
    state: [canvasState, ],
  } = useCanvasContext();

  const [shapes, setShapes] = useState({});

  useEffect(() => {
    let allShapes = {};
    const pointsToShow = Object.entries(pointsSet).filter(([geometryPointKey, entry]) => {return entry && entry.x && entry.y});
    for (const [geometryPointKey, {x: x, y: y, color: color}] of pointsToShow) {
      allShapes[geometryPointKey] = {shape: {type:"point", x: x, y: y}, color: color};
    }
    setShapes(allShapes);
  }, [pointsSet, canvasState.canvas]);

  return (
    <>
      { Object.keys(shapes).map((key, i) => 
        <PointMarker key={'PointMarker'+i} shape={shapes[key]}/>
      )}
    </>
  );
}

export default GeometryPointVisualization;