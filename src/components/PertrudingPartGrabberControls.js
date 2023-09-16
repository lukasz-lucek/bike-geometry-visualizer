import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { useGeometryContext } from '../contexts/GeometryContext';
import { findIntermediatePoint } from '../utils/GeometryUtils';
import PertrudingPartGrabber from './PertrudingPartGrabber';
import RectanglePartGrabber from './RectanglePartGrabber';

export function PertrudingPartGrabberControls({partKey, anchorPoints, pxPerMm, lengthName, widthName, connectorWidthName, children}) {

  const {
    state: [canvasState, ],
  } = useCanvasContext(); 

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);
  const [localPoints, setLocalPoints] = useState({});
  // const [rightOffsetHighlight, setRightOffsetHighlight] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updateParts = (newPartialParts) => {
    if (newPartialParts[partKey].length) {
      const points = geometryState.geometryPoints;
      const endPoint = findIntermediatePoint(points[anchorPoints.tl], points[anchorPoints.bl], -newPartialParts[partKey].length  * pxPerMm);
      newPartialParts[partKey].endPoint = endPoint;
    }
    updateGeometryState({parts: {...geometryState.parts, ...newPartialParts}});
  }

  useEffect(() => {
    const defaultPartSetup = {
      length : 50,
      width: 10,
      connectorWidth: 10,
    };
    const parts = geometryState.parts;
    if (!parts || !parts[partKey]) {
      updateParts(Object.fromEntries([[partKey, defaultPartSetup]]));
    } else {
      updateParts(Object.fromEntries([[partKey, parts[partKey]]]));
    }
  }, [geometryState.geometryPoints]);

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (geometryState.parts && geometryState.parts[partKey]) {
      const endPoint = geometryState.parts[partKey]?.endPoint;
      if (endPoint) {
        setLocalPoints({
          partStart: points[anchorPoints.tl],
          partEnd: endPoint,
        })
      }
    }
  }, [geometryState.geometryPoints, geometryState.parts]);

  const updateLength = (val) => {
    let curPartSetup = geometryState.parts[partKey];
    curPartSetup.length += val;
    updateParts(Object.fromEntries([[partKey, curPartSetup]]));
  }

  const updateWidth = (val) => {
    let curPartSetup = geometryState.parts[partKey];
    curPartSetup.width += val;
    updateParts(Object.fromEntries([[partKey, curPartSetup]]));
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
            <td>{ geometryState.parts && geometryState.parts[partKey]?.length?.toFixed(0)}</td>
            <td><button onClick={() => {updateLength(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateLength(-singleStep)}}>-</button></td>
          </tr>

          <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>{widthName ? widthName : "Width"}</td>
            <td>{ geometryState.parts && geometryState.parts[partKey]?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
          </tr>

          {partHighlight &&
              <RectanglePartGrabber 
                points = {localPoints}
                leftOffset = {0} 
                rightOffset = {0} 
                width = {geometryState.parts[partKey]?.width}
                anchorPoints = {{
                  tl: "partStart",
                  bl: "partStart",
                  tr: "partEnd",
                  br: "partEnd",
                }}
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