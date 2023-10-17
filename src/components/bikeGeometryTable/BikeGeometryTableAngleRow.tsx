import Color from 'color';
import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { Point2d } from '../../interfaces/Point2d';
import { AngleMarker, Angle } from '../drawing/AngleMarker';

export interface TableAngleRowPropsType {
  value: number,
  startPoint: Point2d | null,
  middlePoint: Point2d | null,
  endPoint: Point2d | null,
  strokeWidth: number,
  children: ReactNode,
}

const BikeGeometryTableAngleRow = (
  {
    value,
    startPoint,
    middlePoint,
    endPoint,
    strokeWidth,
    children
  }: TableAngleRowPropsType) => {

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [angle, setAngle] = useState<Angle | null>(null);

  const visualizationColor = Color("red");

  useEffect(() => {
    if (startPoint && middlePoint && endPoint) {
      setAngle({
        strokeWidth: strokeWidth,
        x1: startPoint.x,
        y1: startPoint.y,
        x2: middlePoint.x,
        y2: middlePoint.y,
        x3: endPoint.x,
        y3: endPoint.y,
        color: visualizationColor,
      })
    }
  }, [startPoint, middlePoint, endPoint]);

  return (
    <tr onMouseEnter={() => { setIsHighlighted(true) }} onMouseLeave={() => { setIsHighlighted(false) }}>
      <td>{children}</td>
      <td>{value ? value.toFixed(0) : 0}</td>
      {isHighlighted && angle && <AngleMarker angle={angle} />}
    </tr>
  );
};

export default BikeGeometryTableAngleRow;
