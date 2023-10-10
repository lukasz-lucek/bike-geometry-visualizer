import React, { useState, useEffect } from 'react';
import { GeometryPoints } from '../../contexts/GeometryContext';
import { ColorPoint2d } from '../../interfaces/Point2d';
import PointMarker from './PointMarker';

export function GeometryPointVisualization({pointsSet} : {pointsSet: GeometryPoints}) {

  const [shapes, setShapes] = useState<Map<string, ColorPoint2d>>(new Map());

  useEffect(() => {
    let allShapes : Map<string, ColorPoint2d> = new Map();
    const entries = Object.entries(pointsSet);
    const pointsToShow = Object.entries(pointsSet).filter(([_, entry]) => {return entry && entry.x && entry.y});
    for (const [geometryPointKey, {x: x, y: y, color: color}] of pointsToShow) {
      allShapes.set(geometryPointKey,  {x: x, y: y, color: color});
    }
    setShapes(allShapes);
  }, [pointsSet]);

  return (
    <>
      { [...shapes].map(([key, value], index) => 
        <PointMarker key={'PointMarker'+key} shape={value}/>
      )}
    </>
  );
}

export default GeometryPointVisualization;