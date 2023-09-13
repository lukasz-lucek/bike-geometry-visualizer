import React, { createContext, useContext, useState } from 'react';

const MeasurementsContext = createContext();

export const useMeasurementsContext = () => {
  return useContext(MeasurementsContext);
};

export const MeasurementsProvider = ({ children }) => {

  const defaultState = {
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

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
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
