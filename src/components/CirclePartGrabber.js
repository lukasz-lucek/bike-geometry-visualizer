import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import CircleMarker from './CircleMarker';

export function CirclePartGrabber({radius, centerPoint, pxPerMm, strokeWidth, placementPoint=null, desiredPxPerMM=null, layer=3}) {

  const {
    state: [canvasState, ],
  } = useCanvasContext(); 

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  const [shape, setShape] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points) {
      return;
    }
    if (!points[centerPoint]) {
      return;
    }

    const newShape = {
      shape : {
        type: 'circle',
        strokeWidth: strokeWidth,
        x: points[centerPoint].x,
        y: points[centerPoint].y,
        radius: radius * pxPerMm,
        startAngle: 0,
        endAngle: 360,
      },
      color: 'blue'
    }
    setShape(newShape);
    if (desiredPxPerMM != null) {
      setScale(desiredPxPerMM/pxPerMm);
    }
  }, [radius, centerPoint, pxPerMm, strokeWidth, geometryState.geometryPoints, desiredPxPerMM])


  return (
    <>
      {shape && 
        <CircleMarker
          shape={shape}
          canvas={canvasState.canvas}
          placementPoint={placementPoint}
          scale={scale}
          layer={layer}/>
      }
    </>
  );
}

export default CirclePartGrabber;