import React, { Children, ReactNode, useEffect, useState } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { GeometryFixedCircles, GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { FixedCircle } from '../../interfaces/FixedCircle';
import { Point2d } from '../../interfaces/Point2d';
import { CirclePartGrabber } from '../grabbers/CirclePartGrabber';
import PointMoveControls from './PointMoveControls';

interface CirclePartGrabberControlsProps {
  partKey: keyof GeometryFixedCircles;
  centerPoint: Point2d | null;
  pxPerMm: number;
  children: ReactNode;
  pointKey: keyof GeometryPoints | null;
}

export function CirclePartGrabberControls({
  partKey,
  centerPoint,
  pxPerMm,
  children,
  pointKey }: CirclePartGrabberControlsProps) {

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints: Partial<GeometryFixedCircles>) => {
    updateGeometryState({ fixedCircles: { ...geometryState.fixedCircles, ...newPartialPoints } });
  }

  const updateRadius = (val: number) => {
    let curPartSetup = geometryState.fixedCircles[partKey];
    if (!curPartSetup) {
      return;
    }
    curPartSetup.radius += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  return (
    <div onMouseEnter={() => { setPartHighlight(true) }} onMouseLeave={() => { setPartHighlight(false) }}>
      <table>
        <thead>
          <tr>
            <th>{children}</th>
          </tr>
        </thead>
        <tbody>

          <tr >
            <td>Radius</td>
            <td>{(geometryState.fixedCircles[partKey])?.radius?.toFixed(0)}</td>
            <td><button onClick={() => { updateRadius(singleStep) }}>+</button></td>
            <td><button onClick={() => { updateRadius(-singleStep) }}>-</button></td>
            {partHighlight &&
              <CirclePartGrabber
                radius={(geometryState.fixedCircles[partKey])?.radius || 0}
                centerPoint={centerPoint}
                pxPerMm={pxPerMm}
                strokeWidth={1} />}
          </tr>
        </tbody>
      </table>
      {pointKey &&
      <PointMoveControls pointKey={pointKey}/>
      }
    </div>
  );
}

export default CirclePartGrabberControls;