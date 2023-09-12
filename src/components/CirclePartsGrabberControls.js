import React, { Children, useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import { CirclePartGrabber } from './CirclePartGrabber';

export function CirclePartGrabberControls({partKey, centerPoint, pxPerMm, children}) {

  const {
    state: [canvasState, ],
  } = useCanvasContext(); 

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints) => {
    updateGeometryState({geometryPoints: {...geometryState.geometryPoints, ...newPartialPoints}});
  }

  const defaultPartSetup = {
    radius : 0
  }

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points[partKey]) {
      updatePoints(Object.fromEntries([[partKey, defaultPartSetup]]));
    }
  }, [geometryState.geometryPoints]);

  const updateRadius = (val) => {
    let curPartSetup = geometryState.geometryPoints[partKey];
    curPartSetup.radius += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>{children}</th>
          </tr>
        </thead>
        <tbody>

          <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>Radius</td>
            <td>{ geometryState.geometryPoints[partKey]?.radius?.toFixed(0)}</td>
            <td><button onClick={() => {updateRadius(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateRadius(-singleStep)}}>-</button></td>
            {partHighlight &&
              <CirclePartGrabber
                radius = {geometryState.geometryPoints[partKey]?.radius}
                centerPoint = {centerPoint}
                pxPerMm = {pxPerMm}
                strokeWidth = {1}/>}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CirclePartGrabberControls;