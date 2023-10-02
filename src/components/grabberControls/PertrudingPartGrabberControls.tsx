import React, { ReactNode, useEffect, useState } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { Point2d } from '../../interfaces/Point2d';
import { SemiFixedRectangle } from '../../interfaces/Rectangles';
import PertrudingPartGrabber from '../grabbers/PertrudingPartGrabber';

interface PertrudingPartGrabberControlsProps {
  partKey : keyof GeometryPoints;
  anchorPoints : {
    tl: Point2d | null;
    bl: Point2d | null;
  }
  pxPerMm: number;
  lengthName: string,
  widthName: string,
  defaultPartSetup : {
    length: number;
    width: number;
  }
  children : ReactNode;
}

export function PertrudingPartGrabberControls({
  partKey,
  anchorPoints,
  pxPerMm,
  lengthName,
  widthName,
  defaultPartSetup={
    length : 40,
    width : 30,
  },
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

  const updatePoints = (newPartialPoints : Partial<GeometryPoints>) => {
    updateGeometryState({geometryPoints: {...geometryState.geometryPoints, ...newPartialPoints}});
  }

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points[partKey]) {
      updatePoints(Object.fromEntries([[partKey, defaultPartSetup]]));
    }
  }, [geometryState.geometryPoints]);

  const updateLength = (val : number) => {
    let curPartSetup = geometryState.geometryPoints[partKey] as SemiFixedRectangle;
    curPartSetup.length += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  const updateWidth = (val : number) => {
    let curPartSetup = geometryState.geometryPoints[partKey] as SemiFixedRectangle;
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
            <td>{ geometryState.geometryPoints && (geometryState.geometryPoints[partKey] as SemiFixedRectangle)?.length?.toFixed(0)}</td>
            <td><button onClick={() => {updateLength(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateLength(-singleStep)}}>-</button></td>
          </tr>

          <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>{widthName ? widthName : "Width"}</td>
            <td>{ geometryState.geometryPoints && (geometryState.geometryPoints[partKey] as SemiFixedRectangle)?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
          </tr>

          {partHighlight &&
              <PertrudingPartGrabber 
                width = {(geometryState.geometryPoints[partKey] as SemiFixedRectangle)?.width}
                length = {(geometryState.geometryPoints[partKey] as SemiFixedRectangle)?.length}
                anchorPoints = {anchorPoints}
                pxPerMm = {pxPerMm}
                strokeWidth = {1}/>}

          {/* <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>Width</td>
            <td>{ geometryState.geometryPoints[partKey]?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
            {(partHighlight || leftOffsetHighlight || rightOffsetHighlight) &&
              <PertrudingPartGrabber 
                leftOffset = {geometryState.geometryPoints[partKey]?.leftOffset} 
                rightOffset = {geometryState.geometryPoints[partKey]?.rightOffset} 
                width = {geometryState.geometryPoints[partKey]?.width}
                anchorPoints = {anchorPoints}
                pxPerMm = {pxPerMm}
                strokeWidth = {1}/>} */}
          {/* </tr> */}
        </tbody>
      </table>
    </div>
  );
}

export default PertrudingPartGrabberControls;