import React, { createContext, ReactNode, useContext, useState } from 'react';
import { HandlebarMeasures, Measures } from './MeasurementsContext';
import { OffsetSpline } from '../interfaces/Spline';
import GeometryStatesSerializer from './GeometryStatesSerilizer';
import {IGeometryState, IGeometryPoints, IGeometryOffsetFixedRectangles, IGeometrySemiFixedRectangles, IGeometryFixedRectangles, IGeometryFixedCircles, IGeometryPolygons} from '../../../shared/types/IGeometryState'


export interface GeometryPoints extends IGeometryPoints{
}

export interface GeometryOffsetFixedRectangles extends IGeometryOffsetFixedRectangles {
}

export interface GeometrySemiFixedRectangles extends IGeometrySemiFixedRectangles {
}

export interface GeometryFixedRectangles extends IGeometryFixedRectangles {
}

export interface GeometryFixedCircles extends IGeometryFixedCircles {
}

export interface GeometryPolygons extends IGeometryPolygons{
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

export const defaultOffsetFixedRectangles: IGeometryOffsetFixedRectangles = {
  crankArm: { leftOffset: 0, rightOffset: 0, width: 40 },
  seatstay: { leftOffset: 0, rightOffset: 100, width: 40 },
  chainstay: { leftOffset: 0, rightOffset: 0, width: 40 },
  fork: { leftOffset: 0, rightOffset: 0, width: 50 },
  seatTube: { leftOffset: 0, rightOffset: 0, width: 40 },
  headTube: { leftOffset: 0, rightOffset: 0, width: 60 },
  bottomTube: { leftOffset: 0, rightOffset: 50, width: 60 },
  topTube: { leftOffset: 30, rightOffset: 30, width: 50 },
}

export const defaultSemiFixedRectangles: IGeometrySemiFixedRectangles = {
  seatpost: { width: 40, length: 150 },
  headstack: { width: 35, length: 30 },
}

export const defaultFixedRectangles: IGeometryFixedRectangles = {
  stem: { width: 40 },
}

export const defaultFixedCircles: IGeometryFixedCircles = {
  rearWheel: { radius: 350 },
  frontWheel: { radius: 350 },
  chainring: { radius: 100 },
  seatpostYoke: { radius: 20 },
}

export const defaultPolygons: IGeometryPolygons = {
  shifter: { vertices: []},
  seat: {vertices: []},
}

export interface GeometryState extends IGeometryState {
  // sizesTable: Map<string, Measures>;
  // handlebarsTable: Map<string, HandlebarMeasures>;
  handlebarGeometry: OffsetSpline;
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
    selectedFileHash: null,
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
    if (newPartialState.selectedFileHash) {
      console.log("hash of selected file: "+ newPartialState.selectedFileHash);
    }
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
