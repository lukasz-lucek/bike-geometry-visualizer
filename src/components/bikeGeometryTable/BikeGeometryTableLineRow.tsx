import Color from 'color';
import React, {ReactNode, useEffect, useState} from 'react';
import { Point2d } from '../../interfaces/Point2d';
import {LineMarker, Line} from '../drawing/LineMarker';

export interface TableLineRowPropsType {
  value: number,
  startPoint: Point2d | null,
  endPoint: Point2d | null,
  strokeWidth: number,
  children: ReactNode,
}

const BikeGeometryTableLineRow = (
  {
    value,
    startPoint,
    endPoint,
    strokeWidth,
    children
  } : TableLineRowPropsType) => {

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [line, setLine] = useState<Line | null>(null);

  const visualizationColor = Color("red");

  useEffect(() => {
    if (startPoint && endPoint) {
      setLine({
        strokeWidth: strokeWidth,
        p1 : startPoint,
        p2 : endPoint,
        color: visualizationColor,
      })
    }
  }, [startPoint, endPoint, strokeWidth]);

  return (
    <tr onMouseEnter={() => {setIsHighlighted(true)}} onMouseLeave={() => {setIsHighlighted(false)}}>
      <td>{children}</td>
      <td>{value?value.toFixed(0):0}</td>
      {isHighlighted && line && <LineMarker line={line}/>}
    </tr>
  );
};

export default BikeGeometryTableLineRow;
