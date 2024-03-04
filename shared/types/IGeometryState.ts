import { Console } from 'console';

export interface IPoint2d {
  x: number,
  y: number,
}

export interface IColor {
  color: number[],
  model: string,
  valpha: number,
}

//TODO - fix this any color
export interface IColorPoint2d extends IPoint2d {
  color: any | IColor
}

export interface IFixedRectangle {
  width: number;
}

export interface ISemiFixedRectangle extends IFixedRectangle {
  length: number;
}

export interface IOffsetFixedRectangle extends IFixedRectangle {
  leftOffset: number;
  rightOffset: number;
}

export interface IFixedCircle {
  radius: number;
}

export interface IPolygon {
  vertices: IPoint2d[];
}

export interface IGeometryPoints {
  rearWheelCenter: IColorPoint2d | null,
  frontWheelCenter: IColorPoint2d | null,
  headTubeTop: IColorPoint2d | null,
  headTubeBottom: IColorPoint2d | null,
  bottomBracketCenter: IColorPoint2d | null,
  seatTubeTop: IColorPoint2d | null,
  crankArmEnd: IColorPoint2d | null,
  handlebarMount: IColorPoint2d | null,
  seatMount: IColorPoint2d | null,
}

export interface IGeometryOffsetFixedRectangles {
  crankArm: IOffsetFixedRectangle,
  seatstay: IOffsetFixedRectangle,
  chainstay: IOffsetFixedRectangle,
  fork: IOffsetFixedRectangle,
  seatTube: IOffsetFixedRectangle,
  headTube: IOffsetFixedRectangle,
  bottomTube: IOffsetFixedRectangle,
  topTube: IOffsetFixedRectangle,
}

export interface IGeometrySemiFixedRectangles {
  seatpost: ISemiFixedRectangle,
  headstack: ISemiFixedRectangle,
}

export interface IGeometryFixedRectangles {
  stem: IFixedRectangle,
}

export interface IGeometryFixedCircles {
  rearWheel: IFixedCircle,
  frontWheel: IFixedCircle,
  chainring: IFixedCircle,
  seatpostYoke: IFixedCircle,
}

export interface IGeometryPolygons {
  shifter: IPolygon;
  seat: IPolygon;
}

export interface IGeometryState {

  geometryPoints: IGeometryPoints;
  wheelbase: number;
  selectedFile: null | string;
  bikesList: string[];
  shifterMountOffset: number;
  seatRailAngle: number;
  offsetFixedRectangles: IGeometryOffsetFixedRectangles;
  semiFixedRectangles: IGeometrySemiFixedRectangles;
  fixedRectangles: IGeometryFixedRectangles;
  fixedCircles: IGeometryFixedCircles;
  polygons: IGeometryPolygons;
}