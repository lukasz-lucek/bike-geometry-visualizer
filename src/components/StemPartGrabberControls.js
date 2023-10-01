import React, { Children, useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import { findIntermediatePoint } from '../utils/GeometryUtils';
import RectanglePartGrabber from './grabbers/RectanglePartGrabber';

export function StemPartGrabberControls({
  partKey,
  anchorPoints,
  pxPerMm,
  defaultPartSetup={
    width: 10,
  },
  children}) {

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);
  const [stemStartPoint, setStemStartPoint] = useState(null);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints) => {
    updateGeometryState({geometryPoints: {...geometryState.geometryPoints, ...newPartialPoints}});
  }

  useEffect(() => {
    const points = geometryState.geometryPoints;
    const width = points[partKey] ? points[partKey].width : defaultPartSetup.width;
    if (!points[partKey]) {
      updatePoints(Object.fromEntries([[partKey, defaultPartSetup]]));
    }
    if (points[anchorPoints.tl] && points[anchorPoints.bl] && points[anchorPoints.offset]) {
      const startPoint = findIntermediatePoint(
        points[anchorPoints.tl],
        points[anchorPoints.bl],
        -(points[anchorPoints.offset].length + width/2)  * pxPerMm);
      setStemStartPoint(startPoint);
    }
  }, [geometryState.geometryPoints, defaultPartSetup]);

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
            <td>Width</td>
            <td>{ geometryState.geometryPoints[partKey]?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
            {(partHighlight) &&
              <RectanglePartGrabber 
                leftOffset = {0} 
                rightOffset = {0} 
                width = {geometryState.geometryPoints[partKey]?.width}
                anchorPoints = {{tl: null, bl: null, tr: null, br: null}}
                overridePoints = {{
                  leftOffsetPoint : stemStartPoint,
                  rightOffsetPoint : geometryState.geometryPoints[anchorPoints.tr]
                }}
                pxPerMm = {pxPerMm}
                strokeWidth = {1}/>}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StemPartGrabberControls;