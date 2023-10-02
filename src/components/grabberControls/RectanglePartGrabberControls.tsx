import React, { ReactNode, useEffect, useState } from 'react';
import { GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { Point2d } from '../../interfaces/Point2d';
import { OffsetFixedRectangle } from '../../interfaces/Rectangles';
import OffsetGrabber from '../grabbers/OffsetGrabber';
import RectanglePartGrabber from '../grabbers/RectanglePartGrabber';

interface RectanglePartGrabberControlsProps {
  partKey : keyof GeometryPoints,
  anchorPoints : {
    tl: Point2d | null;
    bl: Point2d | null;
    tr: Point2d | null;
    br: Point2d | null;
  };
  pxPerMm : number,
  defaultPartSetup? : {
    leftOffset : number,
    rightOffset : number,
    width: number,
  };
  children? : ReactNode;
  forceOffset? : {
    left: Boolean;
    right: Boolean;
  };
}

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
  }} : RectanglePartGrabberControlsProps) {

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);
  const [leftOffsetHighlight, setLeftOffsetHighlight] = useState(false);
  const [rightOffsetHighlight, setRightOffsetHighlight] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const part = (geometryState.geometryPoints[partKey] as OffsetFixedRectangle);

  const updatePoints = (newPartialPoints : Partial<GeometryPoints>) => {
    updateGeometryState({geometryPoints: {...geometryState.geometryPoints, ...newPartialPoints}});
  }

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points[partKey]) {
      updatePoints(Object.fromEntries([[partKey, defaultPartSetup]]));
    }
  }, [geometryState.geometryPoints, defaultPartSetup]);

  const updateLeftOffset = (val : number) => {
    let curPartSetup = geometryState.geometryPoints[partKey] as OffsetFixedRectangle;
    curPartSetup.leftOffset += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  const updateRightOffset = (val : number) => {
    let curPartSetup = geometryState.geometryPoints[partKey] as OffsetFixedRectangle;
    curPartSetup.rightOffset += val;
    updatePoints(Object.fromEntries([[partKey, curPartSetup]]));
  }

  const updateWidth = (val : number) => {
    let curPartSetup = geometryState.geometryPoints[partKey] as OffsetFixedRectangle;
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
            <td>{ part?.leftOffset?.toFixed(0)}</td>
            <td><button onClick={() => {updateLeftOffset(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateLeftOffset(-singleStep)}}>-</button></td>
            {leftOffsetHighlight &&
              <OffsetGrabber 
                offset = {part?.leftOffset} 
                topAnchor = {anchorPoints.tl} 
                bottomAnchor = {anchorPoints.bl}
                pxPerMm = {pxPerMm}
                strokeWidth = {5}/>}
          </tr>
          }

          {(forceOffset.right || anchorPoints.tr != anchorPoints.br) &&
          <tr onMouseEnter={() => {setRightOffsetHighlight(true)}} onMouseLeave={() => {setRightOffsetHighlight(false)}}>
            <td>R-Off</td>
            <td>{ part?.rightOffset?.toFixed(0)}</td>
            <td><button onClick={() => {updateRightOffset(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateRightOffset(-singleStep)}}>-</button></td>
            {rightOffsetHighlight &&
              <OffsetGrabber 
                offset = {part?.rightOffset} 
                topAnchor = {anchorPoints.tr} 
                bottomAnchor = {anchorPoints.br}
                pxPerMm = {pxPerMm}
                strokeWidth = {5}/>}
          </tr>
          }

          <tr onMouseEnter={() => {setPartHighlight(true)}} onMouseLeave={() => {setPartHighlight(false)}}>
            <td>Width</td>
            <td>{ part?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
            {(partHighlight || leftOffsetHighlight || rightOffsetHighlight) &&
              <RectanglePartGrabber 
                leftOffset = {part?.leftOffset} 
                rightOffset = {part?.rightOffset} 
                width = {part?.width}
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