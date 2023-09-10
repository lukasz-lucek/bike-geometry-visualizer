// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';
import { findPxPerMm } from '../utils/GeometryUtils.js';
import './BikeGeometryTable.css'; // Import the CSS file
import BikeGeometryTableAngleRow from './BikeGeometryTableAngleRow.js';
import BikeGeometryTableLineRow from './BikeGeometryTableLineRow.js';

const BikeGeometryTable = ({ points, wheelbase, children }) => {

  const {
    state: [contextState, ],
  } = useCanvasContext(); 

  const defaultState = {
    highlightedElement : null,
    measures: {
      stack: 0,
      reach: 0,
      topTube: 0,
      seatTubeCT: 0,
      headAngle: 0,
      seatAngle: 0,
      headTube: 0,
      chainstay: 0,
      bbDrop: 0,
      crankArm: 0,
      wheelbase: 0,
    },
    helpserPoints: {

    },
    pxPerMm: 0,
    strokeWidth: 5,
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    const newState = {...state, ...newPartialState};
    setState( newState );
  }

  const visualizationColor = "red";

  useEffect(() => {
    const finalWheelbase=wheelbase ? Number(wheelbase) : 0;

    let stack=0;
    let reach=0;
    let topTube=0;
    let seatTubeCT=0;
    let headAngle=0;
    let seatAngle=0;
    let headTube=0;
    let chainstay=0;
    let bbDrop=0;
    let crankArm=0;
    
    let pxPerMm=0;
    let strokeWidth=5;

    let wheelBaseEnd=null;
    let bbTop=null;
    let stackReachTouch=null;
    let topTubeEffEnd=null;
    let headAngleCenter=null;
    let headAngleStart=null;
    let seatAngleStart=null;

    const rearWheelCenter = points["rearWheelCenter"];
    const frontWheelCenter = points["frontWheelCenter"];

    if (rearWheelCenter && frontWheelCenter) {
      pxPerMm = findPxPerMm(rearWheelCenter, frontWheelCenter, wheelbase)
      strokeWidth = strokeWidth*pxPerMm;

      wheelBaseEnd = {x: frontWheelCenter.x, y: rearWheelCenter.y}


      const bottomBracketCenter = points["bottomBracketCenter"];
      const headTubeTop = points["headTubeTop"];
      const seatTubeTop = points["seatTubeTop"];
      const headTubeBottom = points["headTubeBottom"];
      const crankArmEnd = points["crankArmEnd"];

      if (bottomBracketCenter && headTubeTop) {
          stack = Math.abs(headTubeTop.y - bottomBracketCenter.y) / pxPerMm;
          reach = Math.abs(headTubeTop.x - bottomBracketCenter.x) / pxPerMm;
          stackReachTouch = {x: bottomBracketCenter.x, y: headTubeTop.y}
      }

      if (seatTubeTop && bottomBracketCenter) {
          seatTubeCT = Math.sqrt(Math.pow(bottomBracketCenter.x - seatTubeTop.x, 2) + Math.pow(bottomBracketCenter.y - seatTubeTop.y, 2)) / pxPerMm;
          const seatAngleRad = Math.atan2(Math.abs(seatTubeTop.y-bottomBracketCenter.y), Math.abs(seatTubeTop.x - bottomBracketCenter.x));
          seatAngle = (seatAngleRad * 180) / Math.PI;

          seatAngleStart = {
            x: rearWheelCenter.x,
            y: bottomBracketCenter.y,
          }
          
          if (headTubeTop) {
              const seatAngleRadTo90 = (Math.PI / 2.0) - seatAngleRad;
              topTube = reach + Math.tan(seatAngleRadTo90) * stack;
              topTubeEffEnd = {x: headTubeTop.x - topTube * pxPerMm, y: headTubeTop.y};
          }
      }
      
      if (headTubeBottom && headTubeTop) {
          headTube = Math.sqrt(Math.pow(headTubeBottom.x - headTubeTop.x, 2) + Math.pow(headTubeBottom.y - headTubeTop.y, 2)) / pxPerMm;
          headAngle = (Math.atan2(Math.abs(headTubeTop.y-headTubeBottom.y), Math.abs(headTubeTop.x - headTubeBottom.x)) * 180) / Math.PI;

          headAngleCenter = {
            x: headTubeTop.x + (frontWheelCenter.y - headTubeTop.y) / Math.tan(headAngle * Math.PI / 180.0),
            y: frontWheelCenter.y,
          }
          headAngleStart = {
            x: bottomBracketCenter.x,
            y: frontWheelCenter.y,
          }
      }

      if (bottomBracketCenter) {
          chainstay = Math.sqrt(Math.pow(bottomBracketCenter.x - rearWheelCenter.x, 2) + Math.pow(bottomBracketCenter.y - rearWheelCenter.y, 2)) / pxPerMm;
          bbDrop = Math.abs(bottomBracketCenter.y - rearWheelCenter.y) / pxPerMm;
          bbTop = {x: bottomBracketCenter.x, y: rearWheelCenter.y};

          if (crankArmEnd) {
            crankArm = Math.sqrt(Math.pow(bottomBracketCenter.x - crankArmEnd.x, 2) + Math.pow(bottomBracketCenter.y - crankArmEnd.y, 2)) / pxPerMm;
          }
      }
    }
    updateState({
      measures: {
        stack: stack,
        reach: reach,
        topTube: topTube,
        seatTubeCT: seatTubeCT,
        headAngle: headAngle,
        seatAngle: seatAngle,
        headTube: headTube,
        chainstay: chainstay,
        bbDrop: bbDrop,
        crankArm: crankArm,
        wheelbase: finalWheelbase,
      },
      helpserPoints: {
        wheelBaseEnd,
        bbTop,
        stackReachTouch,
        topTubeEffEnd,
        headAngleCenter,
        headAngleStart,
        seatAngleStart,
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
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default BikeGeometryTable;
