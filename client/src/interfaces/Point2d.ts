import Color from "color";
//import {IPoint2d, IColorPoint2d} from "../../../shared/types/IGeometryState"

export interface IPoint2d {
  x: number,
  y: number,
}

export interface IColor {
  color: number[],
  model: string,
  valpha: number,
}

export interface IColorPoint2d extends IPoint2d {
  color: any | IColor
}

export interface Point2d extends IPoint2d {
 
}

export interface ColorPoint2d extends IColorPoint2d {
  //color: Color
}

export const equalPoints = (p1: Point2d, p2: Point2d): boolean => {
  return p1.x == p2.x && p1.y == p2.y;
}