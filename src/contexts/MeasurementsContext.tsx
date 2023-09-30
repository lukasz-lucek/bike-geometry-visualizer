import React, { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';

interface MeasurementsState {
  measures: {
    stack: number,
    reach: number,
    topTube: number,
    seatTubeCT: number,
    headAngle: number,
    seatAngle: number,
    headTube: number,
    chainstay: number,
    bbDrop: number,
    crankArm: number,
    wheelbase: number,
  },
  helpserPoints: {
  },
  pxPerMm: number,
  strokeWidth: number,
}

interface MeasurementsContextType {
  state: [MeasurementsState, (newPartialState: Partial<MeasurementsState>) => void];
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

export const useMeasurementsContext = () => {
  const context =  useContext(MeasurementsContext);
  if (!context) {
    throw new Error ('useMeasurementsContext needs to be called from within MeasurementsProvider');
  }
  return context;
};

export const MeasurementsProvider = ({ children } : {children : ReactNode}) => {

  const defaultState : MeasurementsState = {
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
    },
    helpserPoints: {
    },
    pxPerMm: 1,
    strokeWidth: 1,
  }

  const [state, setState] = useState<MeasurementsState>(defaultState);

  const updateState = (newPartialState : Partial<MeasurementsState>) => {
    setState({...state,...newPartialState});
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
