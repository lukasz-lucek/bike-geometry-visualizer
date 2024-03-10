import Color from "color";
import { IColorPoint2d, IPoint2d } from "../IGeometryState";
//import {IPoint2d, IColorPoint2d} from "../../../shared/types/IGeometryState"

export interface Point2d extends IPoint2d {
 
}

export interface ColorPoint2d extends IColorPoint2d {
  color: Color
}

export const equalPoints = (p1: Point2d, p2: Point2d): boolean => {
  return p1.x == p2.x && p1.y == p2.y;
}