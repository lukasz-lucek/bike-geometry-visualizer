import React, { createContext, ReactNode, useContext, useState } from 'react';
import { FixedCircle } from '../interfaces/FixedCircle';
import { ColorPoint2d } from '../interfaces/Point2d';
import { FixedRectangle, OffsetFixedRectangle, SemiFixedRectangle } from '../interfaces/Rectangles';

export interface GeometryPoints {
  rearWheelCenter:  ColorPoint2d | null,
  frontWheelCenter: ColorPoint2d | null,
  headTubeTop: ColorPoint2d | null,
  headTubeBottom: ColorPoint2d | null,
  bottomBracketCenter: ColorPoint2d | null,
  seatTubeTop: ColorPoint2d | null,
  crankArmEnd: ColorPoint2d | null,
  handlebarMount: ColorPoint2d | null,
  seatMount: ColorPoint2d | null,


  crankArm: OffsetFixedRectangle | null,
  seatstay: OffsetFixedRectangle | null,
  chainstay: OffsetFixedRectangle | null,
  fork: OffsetFixedRectangle | null,
  seatTube: OffsetFixedRectangle | null,
  headTube: OffsetFixedRectangle | null,
  bottomTube: OffsetFixedRectangle | null,
  topTube: OffsetFixedRectangle | null,

  seatpost: SemiFixedRectangle | null,
  headstack: SemiFixedRectangle | null,

  stem: FixedRectangle | null,

  rearWheel: FixedCircle | null,
  frontWheel: FixedCircle | null,
  chainring: FixedCircle | null,
  seatpostYoke: FixedCircle | null,
}

const defaultGeometryPoints : GeometryPoints = {
  rearWheelCenter : null,
  frontWheelCenter : null,
  headTubeTop : null,
  headTubeBottom : null,
  bottomBracketCenter : null,
  seatTubeTop : null,
  crankArmEnd : null,
  handlebarMount : null,
  seatMount : null,

  crankArm : null,
  seatstay : null,
  chainstay : null,
  fork : null,
  seatTube : null,
  headTube : null,
  bottomTube : null,
  topTube : null,

  seatpost: null,
  headstack : null,

  stem: null,

  rearWheel: null,
  frontWheel: null,
  chainring: null,
  seatpostYoke: null,
}

export interface GeometryState {
  wheelbase: number | null,
  geometryPoints: GeometryPoints,
  selectedFile: null | string,
  bikesList: string[],
  sizesTable: {}
}

interface GeometryContextType {
  state: [GeometryState, (newPartialState: Partial<GeometryState>) => void];
}

const GeometryContext = createContext<GeometryContextType | undefined>(undefined);

export const useGeometryContext = () => {
  const context =  useContext(GeometryContext);
  if (!context) {
    throw new Error("useGeometryContext must be called from within GeometryProvider")
  }
  return context;
};

export const GeometryProvider = ({ children } : {children : ReactNode}) => {
  const storage = localStorage.getItem("knownGeometries");
  let bikesList : string[] = [];
  if (storage) {
    bikesList = Object.keys(JSON.parse(storage));
  }
  const defaultState : GeometryState = {
    wheelbase: null,
    geometryPoints: defaultGeometryPoints,
    selectedFile: null,
    bikesList: bikesList,
    sizesTable: {}
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState : Partial<GeometryState>) => {
    setState({...state,...newPartialState});
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
