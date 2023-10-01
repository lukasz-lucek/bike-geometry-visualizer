import Color from "color";

export interface Point2d {
  x: number,
  y: number,
}

export interface ColorPoint2d extends Point2d {
  color: Color
}

export const equalPoints = (p1: Point2d, p2: Point2d) : boolean => {
  return p1.x == p2.x && p1.y == p2.y;
}