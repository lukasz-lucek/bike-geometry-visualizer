// src/contexts/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import LayeredCanvas from '../components/drawing/LayeredCanvas';

interface CanvasState {
  canvas: LayeredCanvas | null;
}

interface CanvasContextType {
  state: [CanvasState, (canvasState: CanvasState) => void];
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

  return (
    <CanvasContext.Provider value={{
      state: [state, setState],
    }}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
