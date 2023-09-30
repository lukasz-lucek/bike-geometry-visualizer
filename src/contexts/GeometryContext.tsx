import React, { createContext, ReactNode, useContext, useState } from 'react';

interface GeometryState {
  wheelbase: string,
  geometryPoints: {},
  selectedFile: null | string | ArrayBuffer,
  bikesList: string[],
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
    wheelbase: '',
    geometryPoints: {},
    selectedFile: null,
    bikesList: bikesList,
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
