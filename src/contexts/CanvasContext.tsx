// src/contexts/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CanvasState {
  canvas: fabric.Canvas | null;
}

interface CanvasContextType {
  state: [CanvasState, (newPartialState: Partial<CanvasState>) => void];
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
};

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const defaultState: CanvasState = {
    canvas: null,
  };

  const [state, setState] = useState<CanvasState>(defaultState);

  const updateState = (newPartialState: Partial<CanvasState>) => {
    setState({ ...state, ...newPartialState });
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
