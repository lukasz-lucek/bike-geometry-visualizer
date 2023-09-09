// src/contexts/CanvasContext.js
import React, { createContext, useContext, useState } from 'react';

const CanvasContext = createContext();

export const useCanvasContext = () => {
  return useContext(CanvasContext);
};



export const CanvasProvider = ({ children }) => {
  const defaultState = {
    addLayerToCanvasFunc : (layer) => {},
    enablePointPickerFunc : (color) => {return new Promise ((resolve , reject) => {reject();})},
    disablePointPickerFun : () => {},
    addShapeVisualizationFunc : (shape) => {},
    fixRotationFunc : (angle) => {return new Promise ((resolve , reject) => {reject();})},
    clearCanvas : () => {},
    canvas : null,
  };

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    setState({...state,...newPartialState});
  }

  return (
    <CanvasContext.Provider value={{
        state: [state, updateState],
        }}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
