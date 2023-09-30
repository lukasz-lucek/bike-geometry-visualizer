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

interface CanvasProviderProps {
  children: ReactNode;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const defaultState: CanvasState = {
    canvas : null,
  };

  const [state, setState] = useState<CanvasState>(defaultState);

  const updateState = (newPartialState : Partial<CanvasState>) => {
    setState({...state,...newPartialState});
  }

  const contextValue: CanvasContextType = {
    state: [state, updateState],
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
