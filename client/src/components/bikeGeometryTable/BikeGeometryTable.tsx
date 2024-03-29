// src/components/BikeGeometryTable.js
import React, { ReactNode, useEffect, useState } from 'react';
import { MeasurementsState, useMeasurementsContext } from '../../contexts/MeasurementsContext';
import { findAngle, findAngleRad, findDistance, findIntermediatePoint, findProjectionPointToLine, findPxPerMm } from '../../utils/GeometryUtils';
import BikeGeometryTableAngleRow from './BikeGeometryTableAngleRow';
import BikeGeometryTableLineRow from './BikeGeometryTableLineRow';
import './BikeGeometryTable.css'; // Import the CSS file
import { useGeometryContext } from '../../contexts/GeometryContext';
import { Point2d } from '../../interfaces/Point2d';

const BikeGeometryTable = ({ children }: { children: ReactNode }) => {

  const {
    state: [geometryState,],
  } = useGeometryContext();

  const points = geometryState.geometryPoints;
  const semiFixedRectangles = geometryState.semiFixedRectangles;
  const fixedRectangles = geometryState.fixedRectangles;
  const wheelbase = geometryState.wheelbase;

  const {
    state: [state, setState],
  } = useMeasurementsContext();

  const updateState = (newPartialState: Partial<MeasurementsState>) => {
    const newState = { ...state, ...newPartialState };
    setState(newState);
  }

  useEffect(() => {
    const finalWheelbase = wheelbase ? Number(wheelbase) : 0;

    let stack = 0;
    let reach = 0;
    let topTube = 0;
    let seatTubeCT = 0;
    let headAngle = 0;
    let seatAngle = 0;
    let headTube = 0;
    let chainstay = 0;
    let bbDrop = 0;
    let crankArm = 0;
    let seatpostSetback = 0;
    let spacersStack = semiFixedRectangles.headstack ? semiFixedRectangles.headstack.length : 0;
    let stemLength = 0;
    let stemAngle = 0;
    let seatpostExtension = semiFixedRectangles.seatpost.length;

    let pxPerMm = 0;
    let strokeWidth = 5;

    let wheelBaseEnd = null;
    let bbTop = null;
    let stackReachTouch = null;
    let topTubeEffEnd = null;
    let headAngleCenter = null;
    let headAngleStart = null;
    let seatAngleStart = null;
    let seatMountProjection = null;
    let spacersStackEnd = null;
    let stemStartPoint = null;
    let stemAnglePoint = null;

    const rearWheelCenter = points.rearWheelCenter;
    const frontWheelCenter = points.frontWheelCenter;
    const seatSetback = 0;
    const seatRotation = 0;

    if (rearWheelCenter && frontWheelCenter) {
      pxPerMm = findPxPerMm(rearWheelCenter, frontWheelCenter, wheelbase) ?? 0;
      strokeWidth = strokeWidth * pxPerMm;

      wheelBaseEnd = { x: frontWheelCenter.x, y: rearWheelCenter.y }


      const bottomBracketCenter = points.bottomBracketCenter;
      const headTubeTop = points.headTubeTop;
      const seatTubeTop = points.seatTubeTop;
      const headTubeBottom = points.headTubeBottom;
      const crankArmEnd = points.crankArmEnd;
      const seatMount = points.seatMount;

      if (bottomBracketCenter && headTubeTop) {
        stack = Math.abs(headTubeTop.y - bottomBracketCenter.y) / pxPerMm;
        reach = Math.abs(headTubeTop.x - bottomBracketCenter.x) / pxPerMm;
        stackReachTouch = { x: bottomBracketCenter.x, y: headTubeTop.y }
      }

      if (seatTubeTop && bottomBracketCenter) {
        seatTubeCT = Math.sqrt(Math.pow(bottomBracketCenter.x - seatTubeTop.x, 2) + Math.pow(bottomBracketCenter.y - seatTubeTop.y, 2)) / pxPerMm;
        const seatAngleRad = findAngleRad(seatTubeTop, bottomBracketCenter);
        seatAngle = (seatAngleRad * 180) / Math.PI;

        seatAngleStart = {
          x: rearWheelCenter.x,
          y: bottomBracketCenter.y,
        }

        if (seatMount) {
          // seatpostSetback = findDistanceFromLine(bottomBracketCenter, seatTubeTop, seatMount) / pxPerMm;
          seatMountProjection = findProjectionPointToLine(bottomBracketCenter, seatTubeTop, seatMount);
          seatpostSetback = findDistance(seatMount, seatMountProjection) / pxPerMm;
        }

        if (headTubeTop) {
          const seatAngleRadTo90 = (Math.PI / 2.0) - seatAngleRad;
          topTube = reach + Math.tan(seatAngleRadTo90) * stack;
          topTubeEffEnd = { x: headTubeTop.x - topTube * pxPerMm, y: headTubeTop.y };
        }
      }

      if (headTubeBottom && headTubeTop) {
        headTube = Math.sqrt(Math.pow(headTubeBottom.x - headTubeTop.x, 2) + Math.pow(headTubeBottom.y - headTubeTop.y, 2)) / pxPerMm;
        headAngle = findAngle(headTubeTop, headTubeBottom);
        //headAngle = (Math.atan2(Math.abs(headTubeTop.y-headTubeBottom.y), Math.abs(headTubeTop.x - headTubeBottom.x)) * 180) / Math.PI;

        spacersStackEnd = findIntermediatePoint(headTubeTop, headTubeBottom, -spacersStack * pxPerMm);

        const stemWidth = fixedRectangles.stem?.width;
        if (stemWidth && points.handlebarMount) {
          stemStartPoint = findIntermediatePoint(headTubeTop, headTubeBottom, -(spacersStack + stemWidth / 2) * pxPerMm) as Point2d;
          stemLength = findDistance(stemStartPoint, points.handlebarMount) / pxPerMm;

          stemAngle = findAngle(stemStartPoint, points.handlebarMount) - headAngle + 90;

          stemAnglePoint = findProjectionPointToLine(headTubeTop, headTubeBottom, points.handlebarMount);
        }

        headAngleCenter = {
          x: headTubeTop.x + (frontWheelCenter.y - headTubeTop.y) / Math.tan(headAngle * Math.PI / 180.0),
          y: frontWheelCenter.y,
        }
        headAngleStart = {
          x: (bottomBracketCenter as Point2d).x,
          y: frontWheelCenter.y,
        }
      }

      if (bottomBracketCenter) {
        chainstay = Math.sqrt(Math.pow(bottomBracketCenter.x - rearWheelCenter.x, 2) + Math.pow(bottomBracketCenter.y - rearWheelCenter.y, 2)) / pxPerMm;
        bbDrop = Math.abs(bottomBracketCenter.y - rearWheelCenter.y) / pxPerMm;
        bbTop = { x: bottomBracketCenter.x, y: rearWheelCenter.y };

        if (crankArmEnd) {
          crankArm = Math.sqrt(Math.pow(bottomBracketCenter.x - crankArmEnd.x, 2) + Math.pow(bottomBracketCenter.y - crankArmEnd.y, 2)) / pxPerMm;
        }
      }
    }
    updateState({
      measures: {
        stack,
        reach,
        topTube,
        seatTubeCT,
        headAngle,
        seatAngle,
        headTube,
        chainstay,
        bbDrop,
        crankArm,
        wheelbase: finalWheelbase,
        seatpostSetback,
        spacersStack,
        stemLength,
        stemAngle,
        seatpostExtension,
        seatRotation,
        seatSetback,
      },
      helpserPoints: {
        wheelBaseEnd,
        bbTop,
        stackReachTouch,
        topTubeEffEnd,
        headAngleCenter,
        headAngleStart,
        seatAngleStart,
        seatMountProjection,
        spacersStackEnd,
        stemStartPoint,
        stemAnglePoint,
      },
      pxPerMm: pxPerMm,
      strokeWidth: strokeWidth,
    });
  }, [points, wheelbase]);

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
              value={state.measures.reach}
              startPoint={state.helpserPoints.stackReachTouch}
              endPoint={points["headTubeTop"]}
              strokeWidth={state.strokeWidth}>
              Reach
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.stack}
              startPoint={state.helpserPoints.stackReachTouch}
              endPoint={points["bottomBracketCenter"]}
              strokeWidth={state.strokeWidth}>
              Stack
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.topTube}
              startPoint={state.helpserPoints.topTubeEffEnd}
              endPoint={points["headTubeTop"]}
              strokeWidth={state.strokeWidth}>
              Top Tube (eff)
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.seatTubeCT}
              startPoint={points["seatTubeTop"]}
              endPoint={points["bottomBracketCenter"]}
              strokeWidth={state.strokeWidth}>
              Seat Tube C-T
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.headTube}
              startPoint={points["headTubeTop"]}
              endPoint={points["headTubeBottom"]}
              strokeWidth={state.strokeWidth}>
              Head Tube
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.chainstay}
              startPoint={points["rearWheelCenter"]}
              endPoint={points["bottomBracketCenter"]}
              strokeWidth={state.strokeWidth}>
              Chainstay
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.wheelbase}
              startPoint={points["rearWheelCenter"]}
              endPoint={state.helpserPoints.wheelBaseEnd}
              strokeWidth={state.strokeWidth}>
              Wheelbase
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.bbDrop}
              startPoint={points["bottomBracketCenter"]}
              endPoint={state.helpserPoints.bbTop}
              strokeWidth={state.strokeWidth}>
              BB Drop
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.crankArm}
              startPoint={points["bottomBracketCenter"]}
              endPoint={points["crankArmEnd"]}
              strokeWidth={state.strokeWidth}>
              Crank Arm
            </BikeGeometryTableLineRow>
            <BikeGeometryTableLineRow
              value={state.measures.seatpostSetback}
              startPoint={state.helpserPoints.seatMountProjection}
              endPoint={points["seatMount"]}
              strokeWidth={state.strokeWidth}>
              Seat Setback
            </BikeGeometryTableLineRow>

            <BikeGeometryTableAngleRow
              value={state.measures.headAngle}
              startPoint={state.helpserPoints.headAngleStart}
              middlePoint={state.helpserPoints.headAngleCenter}
              endPoint={points["headTubeTop"]}
              strokeWidth={state.strokeWidth}>
              Head Angle
            </BikeGeometryTableAngleRow>
            <BikeGeometryTableAngleRow
              value={state.measures.seatAngle}
              startPoint={state.helpserPoints.seatAngleStart}
              middlePoint={points["bottomBracketCenter"]}
              endPoint={points["seatTubeTop"]}
              strokeWidth={state.strokeWidth}>
              Seat Angle
            </BikeGeometryTableAngleRow>

            <BikeGeometryTableLineRow
              value={state.measures.spacersStack}
              startPoint={state.helpserPoints.spacersStackEnd}
              endPoint={points["headTubeTop"]}
              strokeWidth={state.strokeWidth}>
              Spacers
            </BikeGeometryTableLineRow>

            <BikeGeometryTableLineRow
              value={state.measures.stemLength}
              startPoint={state.helpserPoints.stemStartPoint}
              endPoint={points["handlebarMount"]}
              strokeWidth={state.strokeWidth}>
              Stem Length
            </BikeGeometryTableLineRow>

            <BikeGeometryTableAngleRow
              value={state.measures.stemAngle}
              startPoint={state.helpserPoints.stemAnglePoint}
              middlePoint={points["handlebarMount"]}
              endPoint={state.helpserPoints.stemStartPoint}
              strokeWidth={state.strokeWidth}>
              Stem Angle
            </BikeGeometryTableAngleRow>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BikeGeometryTable;
