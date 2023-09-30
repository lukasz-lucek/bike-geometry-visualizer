import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import PertrudingPartGrabber from './PertrudingPartGrabber';
import RectanglePartGrabber from './RectanglePartGrabber';

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
}) {

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

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points[partKey]) {
      updatePoints(Object.fromEntries([[partKey, defaultPartSetup]]));
    }
  }, [geometryState.geometryPoints]);

  const updateLength = (val) => {
    let curPartSetup = geometryState.geometryPoints[partKey];
    curPartSetup.length += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  const updateWidth = (val) => {
    let curPartSetup = geometryState.geometryPoints[partKey];
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
            <td>{ geometryState.geometryPoints && geometryState.geometryPoints[partKey]?.length?.toFixed(0)}</td>
            <td><button onClick={() => {updateLength(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateLength(-singleStep)}}>-</button></td>
          </tr>

          <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>{widthName ? widthName : "Width"}</td>
            <td>{ geometryState.geometryPoints && geometryState.geometryPoints[partKey]?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
          </tr>

          {partHighlight &&
              <PertrudingPartGrabber 
                width = {geometryState.geometryPoints[partKey]?.width}
                length = {geometryState.geometryPoints[partKey]?.length}
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