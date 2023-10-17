import React, { ReactNode, useEffect, useState } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { GeometryOffsetFixedRectangles, GeometrySemiFixedRectangles, useGeometryContext } from '../../contexts/GeometryContext';
import { Point2d } from '../../interfaces/Point2d';
import PertrudingPartGrabber from '../grabbers/PertrudingPartGrabber';

interface PertrudingPartGrabberControlsProps {
  partKey : keyof GeometrySemiFixedRectangles;
  anchorPoints : {
    tl: Point2d | null;
    bl: Point2d | null;
  }
  pxPerMm: number;
  lengthName: string,
  widthName: string,
  children : ReactNode;
}

export function PertrudingPartGrabberControls({
  partKey,
  anchorPoints,
  pxPerMm,
  lengthName,
  widthName,
  children
} : PertrudingPartGrabberControlsProps) {

  const {
    state: [canvasState, ],
  } = useCanvasContext(); 

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints : Partial<GeometryOffsetFixedRectangles>) => {
    updateGeometryState({semiFixedRectangles: {...geometryState.semiFixedRectangles, ...newPartialPoints}});
  }

  const updateLength = (val : number) => {
    let curPartSetup = geometryState.semiFixedRectangles[partKey];
    if (!curPartSetup) {
      return;
    }
    curPartSetup.length += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  const updateWidth = (val : number) => {
    let curPartSetup = geometryState.semiFixedRectangles[partKey];
    if (!curPartSetup) {
      return;
    }
    curPartSetup.width += val;
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
            <td>{lengthName ? lengthName : "Length"}</td>
            <td>{ geometryState.geometryPoints && (geometryState.semiFixedRectangles[partKey]).length?.toFixed(0)}</td>
            <td><button onClick={() => {updateLength(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateLength(-singleStep)}}>-</button></td>
          </tr>

          <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>{widthName ? widthName : "Width"}</td>
            <td>{ geometryState.geometryPoints && (geometryState.semiFixedRectangles[partKey]).width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
          </tr>

          {partHighlight &&
              <PertrudingPartGrabber 
                width = {(geometryState.semiFixedRectangles[partKey])?.width || 0}
                length = {(geometryState.semiFixedRectangles[partKey])?.length || 0}
                anchorPoints = {anchorPoints}
                pxPerMm = {pxPerMm}
                strokeWidth = {1}/>}
        </tbody>
      </table>
    </div>
  );
}

export default PertrudingPartGrabberControls;