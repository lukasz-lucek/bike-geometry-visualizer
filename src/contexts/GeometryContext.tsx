import React, { createContext, ReactNode, useContext, useState } from 'react';
import { FixedCircle } from '../interfaces/FixedCircle';
import { ColorPoint2d } from '../interfaces/Point2d';
import { FixedRectangle, OffsetFixedRectangle, SemiFixedRectangle } from '../interfaces/Rectangles';
import { Measures } from './MeasurementsContext';
import { OffsetSpline } from '../interfaces/Spline';
import GeometryStatesSerializer from './GeometryStatesSerilizer';

//TODO - divide by type
export interface GeometryPoints {
  rearWheelCenter: ColorPoint2d | null,
  frontWheelCenter: ColorPoint2d | null,
  headTubeTop: ColorPoint2d | null,
  headTubeBottom: ColorPoint2d | null,
  bottomBracketCenter: ColorPoint2d | null,
  seatTubeTop: ColorPoint2d | null,
  crankArmEnd: ColorPoint2d | null,
  handlebarMount: ColorPoint2d | null,
  seatMount: ColorPoint2d | null,
}

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

const defaultGeometryPoints: GeometryPoints = {
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

export interface GeometryState {
  wheelbase: number;
  geometryPoints: GeometryPoints;
  offsetFixedRectangles: GeometryOffsetFixedRectangles;
  semiFixedRectangles: GeometrySemiFixedRectangles;
  fixedRectangles: GeometryFixedRectangles;
  fixedCircles: GeometryFixedCircles;
  selectedFile: null | string;
  bikesList: string[];
  sizesTable: Map<string, Measures>;
  //handlebarGeometry: OffsetSpline;
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
