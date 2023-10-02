import React, { Children, ReactNode, useEffect, useState } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { FixedCircle } from '../../interfaces/FixedCircle';
import { Point2d } from '../../interfaces/Point2d';
import { CirclePartGrabber } from '../grabbers/CirclePartGrabber';

interface CirclePartGrabberControlsProps {
  partKey : keyof GeometryPoints;
  centerPoint : Point2d | null;
  pxPerMm: number;
  defaultPartSetup : {
    radius: number;
  }
  children : ReactNode;
}

export function CirclePartGrabberControls({
  partKey,
  centerPoint,
  pxPerMm,
  defaultPartSetup={
    radius : 100
  },
  children} : CirclePartGrabberControlsProps) {

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints : Partial<GeometryPoints>) => {
    updateGeometryState({geometryPoints: {...geometryState.geometryPoints, ...newPartialPoints}});
  }

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points[partKey]) {
      updatePoints(Object.fromEntries([[partKey, defaultPartSetup]]));
    }
  }, [geometryState.geometryPoints, defaultPartSetup]);

  const updateRadius = (val : number) => {
    let curPartSetup = geometryState.geometryPoints[partKey] as FixedCircle;
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
            <td>{ (geometryState.geometryPoints[partKey] as FixedCircle)?.radius?.toFixed(0)}</td>
            <td><button onClick={() => {updateRadius(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateRadius(-singleStep)}}>-</button></td>
            {partHighlight &&
              <CirclePartGrabber
                radius = {(geometryState.geometryPoints[partKey] as FixedCircle)?.radius}
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