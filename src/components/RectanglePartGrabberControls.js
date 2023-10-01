import React, { useEffect, useState } from 'react';
import { useGeometryContext } from '../contexts/GeometryContext';
import OffsetGrabber from './grabbers/OffsetGrabber';
import RectanglePartGrabber from './grabbers/RectanglePartGrabber';

export function RectanglePartGrabberControls({
  partKey,
  anchorPoints,
  pxPerMm,
  defaultPartSetup={
    leftOffset : 0,
    rightOffset : 0,
    width: 10,
  },
  children,
  forceOffset={
    left:false,
    right:false,
  }}) {

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);
  const [leftOffsetHighlight, setLeftOffsetHighlight] = useState(false);
  const [rightOffsetHighlight, setRightOffsetHighlight] = useState(false);

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
  }, [geometryState.geometryPoints, defaultPartSetup]);

  const updateLeftOffset = (val) => {
    let curPartSetup = geometryState.geometryPoints[partKey];
    curPartSetup.leftOffset += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  const updateRightOffset = (val) => {
    let curPartSetup = geometryState.geometryPoints[partKey];
    curPartSetup.rightOffset += val;
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
          {(forceOffset.left || anchorPoints.tl != anchorPoints.bl) &&
          <tr onMouseEnter={() => {setLeftOffsetHighlight(true)}} onMouseLeave={() => {setLeftOffsetHighlight(false)}}>
            <td>L-Off</td>
            <td>{ geometryState.geometryPoints[partKey]?.leftOffset?.toFixed(0)}</td>
            <td><button onClick={() => {updateLeftOffset(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateLeftOffset(-singleStep)}}>-</button></td>
            {leftOffsetHighlight &&
              <OffsetGrabber 
                offset = {geometryState.geometryPoints[partKey]?.leftOffset} 
                topAnchor = {anchorPoints.tl} 
                bottomAnchor = {anchorPoints.bl}
                pxPerMm = {pxPerMm}
                strokeWidth = {5}/>}
          </tr>
          }

          {(forceOffset.right || anchorPoints.tr != anchorPoints.br) &&
          <tr onMouseEnter={() => {setRightOffsetHighlight(true)}} onMouseLeave={() => {setRightOffsetHighlight(false)}}>
            <td>R-Off</td>
            <td>{ geometryState.geometryPoints[partKey]?.rightOffset?.toFixed(0)}</td>
            <td><button onClick={() => {updateRightOffset(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateRightOffset(-singleStep)}}>-</button></td>
            {rightOffsetHighlight &&
              <OffsetGrabber 
                offset = {geometryState.geometryPoints[partKey]?.rightOffset} 
                topAnchor = {anchorPoints.tr} 
                bottomAnchor = {anchorPoints.br}
                pxPerMm = {pxPerMm}
                strokeWidth = {5}/>}
          </tr>
          }

          <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>Width</td>
            <td>{ geometryState.geometryPoints[partKey]?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
            {(partHighlight || leftOffsetHighlight || rightOffsetHighlight) &&
              <RectanglePartGrabber 
                leftOffset = {geometryState.geometryPoints[partKey]?.leftOffset} 
                rightOffset = {geometryState.geometryPoints[partKey]?.rightOffset} 
                width = {geometryState.geometryPoints[partKey]?.width}
                anchorPoints = {anchorPoints}
                pxPerMm = {pxPerMm}
                strokeWidth = {1}/>}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RectanglePartGrabberControls;