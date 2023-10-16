import React, { Children, ReactNode, useEffect, useState } from 'react';
import { GeometryFixedRectangles, GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { Point2d } from '../../interfaces/Point2d';
import { FixedRectangle, SemiFixedRectangle } from '../../interfaces/Rectangles';
import { findIntermediatePoint } from '../../utils/GeometryUtils';
import RectanglePartGrabber from '../grabbers/RectanglePartGrabber';

interface StemPartPartGrabberControlsProps {
  partKey : keyof GeometryFixedRectangles;
  anchorPoints : {
    tl: Point2d | null;
    bl: Point2d | null;
    tr: Point2d | null;
    offset: SemiFixedRectangle | null;
  }
  pxPerMm: number;
  defaultPartSetup : FixedRectangle
  children : ReactNode;
}

export function StemPartGrabberControls({
  partKey,
  anchorPoints,
  pxPerMm,
  defaultPartSetup={
    width: 10,
  },
  children} : StemPartPartGrabberControlsProps) {

  const singleStep = 5;

  const [partHighlight, setPartHighlight] = useState(false);
  const [stemStartPoint, setStemStartPoint] = useState<Point2d | null>(null);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const updatePoints = (newPartialPoints : Partial<FixedRectangle>) => {
    updateGeometryState({fixedRectangles: {...geometryState.fixedRectangles, ...newPartialPoints}});
  }

  useEffect(() => {
    const fixedRectangles = geometryState.fixedRectangles;
    const part = fixedRectangles[partKey];
    const width = part ? part.width : defaultPartSetup.width;
    if (!part) {
      updatePoints(Object.fromEntries([[partKey, defaultPartSetup]]));
    }
    if (anchorPoints.tl && anchorPoints.bl && anchorPoints.offset) {
      const startPoint = findIntermediatePoint(
        anchorPoints.tl,
        anchorPoints.bl,
        -(anchorPoints.offset.length + width/2)  * pxPerMm);
      setStemStartPoint(startPoint);
    }
  }, [geometryState.fixedRectangles, defaultPartSetup]);

  const updateWidth = (val : number) => {
    let curPartSetup = geometryState.fixedRectangles[partKey];
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
            <td>Width</td>
            <td>{ (geometryState.fixedRectangles[partKey])?.width?.toFixed(0)}</td>
            <td><button onClick={() => {updateWidth(singleStep)}}>+</button></td>
            <td><button onClick={() => {updateWidth(-singleStep)}}>-</button></td>
            {(partHighlight) &&
              <RectanglePartGrabber 
                leftOffset = {0} 
                rightOffset = {0} 
                width = {(geometryState.fixedRectangles[partKey])?.width || 0}
                anchorPoints = {{tl: stemStartPoint, bl: stemStartPoint, tr: anchorPoints.tr, br: anchorPoints.tr}}
                pxPerMm = {pxPerMm}
                strokeWidth = {1}/>}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StemPartGrabberControls;