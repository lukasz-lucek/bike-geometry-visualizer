// src/components/BikeGeometryTable.js
import React, { ReactNode, useEffect } from 'react';
import { MeasurementsState, useMeasurementsContext } from '../../contexts/MeasurementsContext';
import BikeGeometryTableLineRow from './BikeGeometryTableLineRow';
import './BikeGeometryTable.css'; // Import the CSS file
import { useGeometryContext } from '../../contexts/GeometryContext';
import { findPxPerMm } from '../../utils/GeometryUtils';

const HandlebarGeometryTable = ({ children }: { children: ReactNode }) => {

  const {
    state: [geometryState,],
  } = useGeometryContext();


  const {
    state: [measurementsState, setState],
  } = useMeasurementsContext();

  const updateMeasurementsState = (newPartialState: Partial<MeasurementsState>) => {
    const newState = { ...measurementsState, ...newPartialState };
    setState(newState);
  }

  useEffect(() => {
    //const pxPerMm = measurementsState.pxPerMm;

    const shiftersMountPoint = geometryState.shifterMountOffset;
    let handlebarDrop = 0;
    let handlebarReach = 0;
    let handlebarRaise = 0;
    let handlebarSetback = 0;
    let handlebarRotation = 0;

    let pxPerMm = 1;
    let strokeWidth = 2;

    let handlebarGEometryStart = null;
    let handlebarReachEnd = null;
    let handlebarDropEnd = null;
    let handlebarRaiseEnd = null;
    let handlebarSetbackEnd = null;

    const rearWheelCenter = geometryState.geometryPoints.rearWheelCenter;
    const frontWheelCenter = geometryState.geometryPoints.frontWheelCenter;

    if (rearWheelCenter && frontWheelCenter) {
      pxPerMm = findPxPerMm(rearWheelCenter, frontWheelCenter, geometryState.wheelbase) ?? 0;
      strokeWidth = strokeWidth * pxPerMm;
    }

    const handlebarGeometry = geometryState.handlebarGeometry;

    let {reach, drop, startPoint, endPoint} = handlebarGeometry.getReachAndDropInPx();

    if (!startPoint || !reach) {
      return;
    }

    handlebarReach = reach / pxPerMm;
    handlebarGEometryStart = {x: startPoint.x, y: startPoint.y}
    handlebarReachEnd = {x: startPoint.x + reach, y: startPoint.y}

    if (!endPoint || !drop) {
      return;
    }
    handlebarDrop = drop / pxPerMm;
    handlebarDropEnd = {x: startPoint.x, y: startPoint.y + drop}

    const handlebarMount = geometryState.geometryPoints.handlebarMount;
    if (handlebarMount) {
      handlebarRaise = (handlebarMount.y - startPoint.y) / pxPerMm;
      handlebarSetback = (handlebarMount.x - startPoint.x) / pxPerMm;

      handlebarRaiseEnd = {x: handlebarMount.x, y: startPoint.y};
      handlebarSetbackEnd = {x: startPoint.x, y: handlebarMount.y};
    }

    updateMeasurementsState({
      handlebarMeasures: {
        handlebarDrop,
        handlebarReach,
        handlebarRaise,
        handlebarSetback,
        handlebarRotation,
        shiftersMountPoint,
      },
      handlebarHelpserPoints: {
        handlebarGEometryStart,
        handlebarReachEnd,
        handlebarDropEnd,
        handlebarRaiseEnd,
        handlebarSetbackEnd,
      },
      pxPerMm,
      strokeWidth
    });
  }, [geometryState.geometryPoints, geometryState.wheelbase, geometryState.handlebarGeometry]);

  return (
    <div className="bike-geometry-table">
      <div>
        <h3>{children}</h3>
        <table>
          <thead>
            <tr>
              <th>Spec</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <BikeGeometryTableLineRow
              value={measurementsState.handlebarMeasures.handlebarReach}
              startPoint={measurementsState.handlebarHelpserPoints.handlebarGEometryStart}
              endPoint={measurementsState.handlebarHelpserPoints.handlebarReachEnd}
              strokeWidth={measurementsState.strokeWidth}>
              Reach
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={measurementsState.handlebarMeasures.handlebarDrop}
              startPoint={measurementsState.handlebarHelpserPoints.handlebarGEometryStart}
              endPoint={measurementsState.handlebarHelpserPoints.handlebarDropEnd}
              strokeWidth={measurementsState.strokeWidth}>
              Drop
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={measurementsState.handlebarMeasures.handlebarRaise}
              startPoint={geometryState.geometryPoints.handlebarMount}
              endPoint={measurementsState.handlebarHelpserPoints.handlebarRaiseEnd}
              strokeWidth={measurementsState.strokeWidth}>
              Raise
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={measurementsState.handlebarMeasures.handlebarSetback}
              startPoint={geometryState.geometryPoints.handlebarMount}
              endPoint={measurementsState.handlebarHelpserPoints.handlebarSetbackEnd}
              strokeWidth={measurementsState.strokeWidth}>
              Setback
            </BikeGeometryTableLineRow>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HandlebarGeometryTable;
