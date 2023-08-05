// src/contexts/CanvasContext.js
import React, { createContext, useContext, useState } from 'react';

const CanvasContext = createContext();

export const useCanvasContext = () => {
  return useContext(CanvasContext);
};

export const CanvasProvider = ({ children }) => {
  const [addLayerToCanvasFunc, setAddLayerToCanvas] = useState((layer) => {});
  const [enablePointPickerFunc, setEnablePointPicker] = useState((enabled, color) => {});
  const [pointSelectedFunc, setPointSelected] = useState(null);
  return (
    <CanvasContext.Provider value={{
        addLayer: [addLayerToCanvasFunc, setAddLayerToCanvas],
        enablePointPicker: [enablePointPickerFunc, setEnablePointPicker],
        pointSelected: [pointSelectedFunc, setPointSelected],
        }}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
