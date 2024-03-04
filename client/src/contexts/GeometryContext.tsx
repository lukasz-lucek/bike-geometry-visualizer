import React, { createContext, ReactNode, useContext, useState } from 'react';
import { FixedCircle } from '../interfaces/FixedCircle';
import { FixedRectangle, OffsetFixedRectangle, SemiFixedRectangle } from '../interfaces/Rectangles';
import { HandlebarMeasures, Measures } from './MeasurementsContext';
import { OffsetSpline } from '../interfaces/Spline';
import GeometryStatesSerializer from './GeometryStatesSerilizer';
import { Polygon } from '../interfaces/Polygon';
import {IGeometryState, IGeometryPoints} from '../../../shared/types/IGeometryState'
// import { IGeometryPoints } from '../../../shared/types/IGeometryPoints';

// export interface IPoint2d {
//   x: number,
//   y: number,
// }

// export interface IColor {
//   color: number[],
//   model: string,
//   valpha: number,
// }

// export interface IColorPoint2d extends IPoint2d {
//   color: any | IColor
// }

export interface GeometryPoints extends IGeometryPoints{
}

// export interface GeometryPoints extends IGeometryPoints {

// }

// export interface IGeometryState {
//   geometryPoints: IGeometryPoints;
//   wheelbase: number;
//   selectedFile: null | string;
//   bikesList: string[];
//   shifterMountOffset: number;
//   seatRailAngle: number;
// }

export interface GeometryOffsetFixedRectangles {
  crankArm: OffsetFixedRectangle,
  seatstay: OffsetFixedRectangle,
  chainstay: OffsetFixedRectangle,
  fork: OffsetFixedRectangle,
  seatTube: OffsetFixedRectangle,
  headTube: OffsetFixedRectangle,
  bottomTube: OffsetFixedRectangle,
  topTube: OffsetFixedRectangle,
}

export interface GeometrySemiFixedRectangles {
  seatpost: SemiFixedRectangle,
  headstack: SemiFixedRectangle,
}

export interface GeometryFixedRectangles {
  stem: FixedRectangle,
}

export interface GeometryFixedCircles {
  rearWheel: FixedCircle,
  frontWheel: FixedCircle,
  chainring: FixedCircle,
  seatpostYoke: FixedCircle,
}

export interface GeometryPolygons {
  shifter: Polygon;
  seat: Polygon;
}

const defaultGeometryPoints: IGeometryPoints = {
  rearWheelCenter: null,
  frontWheelCenter: null,
  headTubeTop: null,
  headTubeBottom: null,
  bottomBracketCenter: null,
  seatTubeTop: null,
  crankArmEnd: null,
  handlebarMount: null,
  seatMount: null,
}

export const defaultOffsetFixedRectangles: GeometryOffsetFixedRectangles = {
  crankArm: { leftOffset: 0, rightOffset: 0, width: 40 },
  seatstay: { leftOffset: 0, rightOffset: 100, width: 40 },
  chainstay: { leftOffset: 0, rightOffset: 0, width: 40 },
  fork: { leftOffset: 0, rightOffset: 0, width: 50 },
  seatTube: { leftOffset: 0, rightOffset: 0, width: 40 },
  headTube: { leftOffset: 0, rightOffset: 0, width: 60 },
  bottomTube: { leftOffset: 0, rightOffset: 50, width: 60 },
  topTube: { leftOffset: 30, rightOffset: 30, width: 50 },
}

export const defaultSemiFixedRectangles: GeometrySemiFixedRectangles = {
  seatpost: { width: 40, length: 150 },
  headstack: { width: 35, length: 30 },
}

export const defaultFixedRectangles: GeometryFixedRectangles = {
  stem: { width: 40 },
}

export const defaultFixedCircles: GeometryFixedCircles = {
  rearWheel: { radius: 350 },
  frontWheel: { radius: 350 },
  chainring: { radius: 100 },
  seatpostYoke: { radius: 20 },
}

export const defaultPolygons: GeometryPolygons = {
  shifter: { vertices: []},
  seat: {vertices: []},
}

export interface GeometryState extends IGeometryState {
  offsetFixedRectangles: GeometryOffsetFixedRectangles;
  semiFixedRectangles: GeometrySemiFixedRectangles;
  fixedRectangles: GeometryFixedRectangles;
  fixedCircles: GeometryFixedCircles;
  sizesTable: Map<string, Measures>;
  handlebarsTable: Map<string, HandlebarMeasures>;
  handlebarGeometry: OffsetSpline;
  polygons: GeometryPolygons;
}

interface GeometryContextType {
  state: [GeometryState, (newPartialState: Partial<GeometryState>) => void];
}

const GeometryContext = createContext<GeometryContextType | undefined>(undefined);

export const useGeometryContext = () => {
  const context = useContext(GeometryContext);
  if (!context) {
    throw new Error("useGeometryContext must be called from within GeometryProvider")
  }
  return context;
};

export const GeometryProvider = ({ children }: { children: ReactNode }) => {
  const storage = localStorage.getItem("knownGeometries");
  let bikesList: string[] = [];
  if (storage) {
    const geomStatSerializer = new GeometryStatesSerializer();
    geomStatSerializer.deserialize(storage);
    bikesList = Array.from(geomStatSerializer.knownGeometries.keys());
  }
  const defaultState: GeometryState = {
    wheelbase: 1000,
    geometryPoints: defaultGeometryPoints,
    offsetFixedRectangles: defaultOffsetFixedRectangles,
    semiFixedRectangles: defaultSemiFixedRectangles,
    fixedRectangles: defaultFixedRectangles,
    fixedCircles: defaultFixedCircles,
    selectedFile: null,
    bikesList: bikesList,
    sizesTable: new Map(),
    handlebarsTable: new Map(),
    handlebarGeometry: new OffsetSpline(15),
    shifterMountOffset: 0,
    seatRailAngle: 0,
    polygons: defaultPolygons,
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState: Partial<GeometryState>) => {
    setState({ ...state, ...newPartialState });
  }

  return (
    <GeometryContext.Provider value={{
      state: [state, updateState],
    }}>
      {children}
    </GeometryContext.Provider>
  );
};

export default GeometryProvider;
