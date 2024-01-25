import React, { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';
import { Point2d } from '../interfaces/Point2d';

export interface Measures {
  stack: number;
  reach: number;
  topTube: number;
  seatTubeCT: number;
  headAngle: number;
  seatAngle: number;
  headTube: number;
  chainstay: number;
  bbDrop: number;
  crankArm: number;
  wheelbase: number;
  seatpostSetback: number;
  spacersStack: number;
  stemLength: number;
  stemAngle: number;
}

export interface HandlebarMeasures {
  handlebarDrop: number;
  handlebarReach: number;
  handlebarRaise: number;
  handlebarSetback: number;
}

export interface MeasurementsState {
  measures: Measures,
  handlebarMeasures: HandlebarMeasures,
  helpserPoints: {
    wheelBaseEnd: Point2d | null;
    bbTop: Point2d | null;
    stackReachTouch: Point2d | null;
    topTubeEffEnd: Point2d | null;
    headAngleCenter: Point2d | null;
    headAngleStart: Point2d | null;
    seatAngleStart: Point2d | null;
    seatMountProjection: Point2d | null;
    spacersStackEnd: Point2d | null;
    stemStartPoint: Point2d | null;
    stemAnglePoint: Point2d | null;
  },
  handlebarHelpserPoints: {
    handlebarGEometryStart: Point2d | null;
    handlebarReachEnd: Point2d | null;
    handlebarDropEnd: Point2d | null;
    handlebarRaiseEnd: Point2d | null;
    handlebarSetbackEnd: Point2d | null;
  },
  pxPerMm: number,
  strokeWidth: number,
}

interface MeasurementsContextType {
  state: [MeasurementsState, (newPartialState: Partial<MeasurementsState>) => void];
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

export const useMeasurementsContext = () => {
  const context = useContext(MeasurementsContext);
  if (!context) {
    throw new Error('useMeasurementsContext needs to be called from within MeasurementsProvider');
  }
  return context;
};

export const MeasurementsProvider = ({ children }: { children: ReactNode }) => {

  const defaultState: MeasurementsState = {
    measures: {
      stack: 0,
      reach: 0,
      topTube: 0,
      seatTubeCT: 0,
      headAngle: 0,
      seatAngle: 0,
      headTube: 0,
      chainstay: 0,
      bbDrop: 0,
      crankArm: 0,
      wheelbase: 0,
      seatpostSetback: 0,
      spacersStack: 0,
      stemLength: 0,
      stemAngle: 0,
    },
    handlebarMeasures : {
      handlebarDrop: 0,
      handlebarReach: 0,
      handlebarRaise: 0,
      handlebarSetback: 0,
    },
    helpserPoints: {
      wheelBaseEnd: null,
      bbTop: null,
      stackReachTouch: null,
      topTubeEffEnd: null,
      headAngleCenter: null,
      headAngleStart: null,
      seatAngleStart: null,
      seatMountProjection: null,
      spacersStackEnd: null,
      stemStartPoint: null,
      stemAnglePoint: null,
    },
    handlebarHelpserPoints: {
      handlebarGEometryStart: null,
      handlebarReachEnd: null,
      handlebarDropEnd: null,
      handlebarRaiseEnd: null,
      handlebarSetbackEnd: null,
    },
    pxPerMm: 1,
    strokeWidth: 1,
  }

  const [state, setState] = useState<MeasurementsState>(defaultState);

  const updateState = (newPartialState: Partial<MeasurementsState>) => {
    setState({ ...state, ...newPartialState });
  }

  return (
    <MeasurementsContext.Provider value={{
      state: [state, updateState],
    }}>
      {children}
    </MeasurementsContext.Provider>
  );
};

export default MeasurementsProvider;
