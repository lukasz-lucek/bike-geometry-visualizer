import React, { createContext, useContext, useState } from 'react';

const GeometryContext = createContext();

export const useGeometryContext = () => {
  return useContext(GeometryContext);
};

export const GeometryProvider = ({ children }) => {
  const storage = localStorage.getItem("knownGeometries");
  let bikesList = [];
  if (storage) {
    bikesList = Object.keys(JSON.parse(storage));
  }
  const defaultState = {
    wheelbase: '',
    geometryPoints: {},
    selectedFile: null,
    bikesList: bikesList,
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
