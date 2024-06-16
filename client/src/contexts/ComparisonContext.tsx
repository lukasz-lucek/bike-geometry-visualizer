// src/contexts/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IBikeData } from '../IGeometryState';
import { Point2d } from '../interfaces/Point2d';

export interface IBikeDataComparison extends IBikeData {
  sizeName: string;
  image: string;
  rearWheelCenter: Point2d;
  bottomBracketCenter: Point2d;
  crankArmEnd: Point2d;
}

interface ComparisonState {
  state: [Array<IBikeDataComparison>, (newToCompare: Array<IBikeDataComparison>) => void];
}

const ComparisonContext = createContext<ComparisonState | undefined>(undefined);

export const useComparisonContext = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparisonContext must be used within a ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {

  const [toCompare, setToCompare] = useState<Array<IBikeDataComparison>>([]);

  return (
    <ComparisonContext.Provider value={{
      state: [toCompare, setToCompare]
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export default ComparisonProvider;
