import React, { createContext, useContext, useState } from 'react';

const GeometryContext = createContext();

export const useGeometryContext = () => {
  return useContext(GeometryContext);
};

export const GeometryProvider = ({ children }) => {
  const defaultState = {
    wheelbase: '',
    geometryPoints: {},
    selectedFile: null,
    bikesList: Object.keys(JSON.parse(localStorage.getItem("knownGeometries"))),
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
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
