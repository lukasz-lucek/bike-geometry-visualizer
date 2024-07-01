// src/contexts/CanvasContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IBikeData } from '../IGeometryState';
import { Point2d } from '../interfaces/Point2d';

export interface IBikeDataComparison extends IBikeData {
  sizeName: string;
  
}

export interface IBikeDataComparisonImages {
  image: string;
  rearWheelCenter: Point2d;
  bottomBracketCenter: Point2d;
  crankArmEnd: Point2d;
}

export enum AlignmentPoint {
  REAR_WHHEL = 'REAR_WHHEL',
  BOTTOM_BRACKKET = 'BOTTOM_BRACKKET',
  PEDAL_AXLE = 'PEDAL_AXLE',
}

export interface ComparisonSettings {
  alignmentPoint: AlignmentPoint;
  opacities: Map<string, number>;
}

interface ComparisonState {
  bikes: [Array<IBikeDataComparison>, (newToCompare: Array<IBikeDataComparison>) => void];
  images: [Map<string, IBikeDataComparisonImages>, (images: Map<string, IBikeDataComparisonImages>) => void];
  comparisonSettings: [ComparisonSettings, (settings: ComparisonSettings) => void];
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

  const defaultComparisonSettings : ComparisonSettings = {
    alignmentPoint : AlignmentPoint.PEDAL_AXLE,
    opacities: new Map(),
  }

  const [toCompare, setToCompare] = useState<Array<IBikeDataComparison>>([]);
  const [images, setImages] = useState<Map<string, IBikeDataComparisonImages>>(new Map());
  const [comparisonSettings, setComparisonSettings] = useState<ComparisonSettings>(defaultComparisonSettings);

  return (
    <ComparisonContext.Provider value={{
      bikes: [toCompare, setToCompare],
      images: [images, setImages],
      comparisonSettings: [comparisonSettings, setComparisonSettings],
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export default ComparisonProvider;
