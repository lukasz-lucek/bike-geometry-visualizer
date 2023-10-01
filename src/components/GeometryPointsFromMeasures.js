// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useGeometryContext } from '../contexts/GeometryContext';
import { findPxPerMm, findIntermediatePoint, findPointFromPointAngleLength} from '../utils/GeometryUtils';
import BikeImageStitcher from './stitchers/BikeImageStitcher';
import GeometryPointVisualization from './GeometryPointsVisualization.js';

const GeometryPointsFromMeasures = ({ sizeMeasures, desiredPxPerMM=null}) => {
  
  const {
    state: [geometryContext, ],
  } = useGeometryContext();

  const [state, updateState] = useState();

  useEffect(() => {
    const orgRearWheelCenter = geometryContext.geometryPoints?.rearWheelCenter;
    const orgFrontWheelCenter = geometryContext.geometryPoints?.frontWheelCenter;
    const orgWheelbase = geometryContext.wheelbase;

    const pointsColor = "red";
    const helperPointsColor = "blue";

    if (!orgRearWheelCenter || !orgFrontWheelCenter || !orgWheelbase) {
      return;
    }
    const pxPerMm = findPxPerMm(orgRearWheelCenter, orgFrontWheelCenter, orgWheelbase);
    let dPPMM = desiredPxPerMM;
    if (!desiredPxPerMM) {
      dPPMM = pxPerMm;
    }

    const rearWheelCenter = {
      x: dPPMM * orgRearWheelCenter.x / pxPerMm,
      y: dPPMM * orgRearWheelCenter.y / pxPerMm,
      color: pointsColor,
    }

    let frontWheelCenter = null;
    if (sizeMeasures.wheelbase) {
      frontWheelCenter = {
        x: dPPMM * ((orgRearWheelCenter.x / pxPerMm) + sizeMeasures.wheelbase),
        y: dPPMM * orgRearWheelCenter.y / pxPerMm,
        color: pointsColor,
      }
    }

    let bottomBracketCenter = null;
    let seatTubeTop = null;
    let headTubeTop = null;
    let headTubeBottom = null;
    let seatStayRight= null;
    let seatStayLeft=null;
    let topTubeLeft = null;
    let topTubeRight = null;
    let bottomTubeRight = null;
    let crankArmEnd = null;
    let seatpostEnd = null;
    let spacersEnd = null;
    let stemStart = null;
    let handlebarMount = null;

    const bb = sizeMeasures.bbDrop;
    const cs = sizeMeasures.chainstay;
    if (bb && cs) {
      
      const dx = Math.sqrt(cs*cs - bb*bb);
      bottomBracketCenter = {
        x: dPPMM * ((orgRearWheelCenter.x / pxPerMm) + dx),
        y: dPPMM * ((orgRearWheelCenter.y / pxPerMm) + bb),
        color: pointsColor,
      }

      const seatAngle = sizeMeasures.seatAngle;
      const seatTubeCT = sizeMeasures.seatTubeCT;
      const seatAngleRadians = Math.PI * seatAngle / 180;
      if (seatAngle && seatTubeCT) {
        seatTubeTop = {
          x: bottomBracketCenter.x - dPPMM * (Math.cos(seatAngleRadians) * seatTubeCT),
          y: bottomBracketCenter.y - dPPMM * (Math.sin(seatAngleRadians) * seatTubeCT),
          color: pointsColor,
        }
        if (geometryContext.geometryPoints.seatstay) {
          const seatStayRightPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, geometryContext.geometryPoints.seatstay.rightOffset * dPPMM);
          seatStayRight = {
            x: seatStayRightPoint.x,
            y: seatStayRightPoint.y,
            color: helperPointsColor,
          }
          const rwcl = {
            x:rearWheelCenter.x,
            y:rearWheelCenter.y-10,
          }
          const seatStayLeftPoint = findIntermediatePoint(rearWheelCenter, rwcl, geometryContext.geometryPoints.seatstay.leftOffset * dPPMM);
          console.log("seatStayLeftPoint:", seatStayLeftPoint);
          seatStayLeft = {
            x: seatStayLeftPoint.x,
            y: seatStayLeftPoint.y,
            color: helperPointsColor,
          }
        }
        if (geometryContext.geometryPoints.topTube) {
          const topTubeLeftPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, geometryContext.geometryPoints.topTube.leftOffset * dPPMM);
          topTubeLeft = {
            x: topTubeLeftPoint.x,
            y: topTubeLeftPoint.y,
            color: helperPointsColor,
          }
        }

        if (geometryContext.geometryPoints.crankArmEnd) {
          const crankArmEndPoint = findIntermediatePoint(bottomBracketCenter, seatTubeTop, - sizeMeasures.crankArm * dPPMM);
          crankArmEnd = {
            x: crankArmEndPoint.x,
            y: crankArmEndPoint.y,
            color: helperPointsColor,
          }
        }

        if (geometryContext.geometryPoints.seatpost) {
          const seatpostEndPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, - geometryContext.geometryPoints.seatpost.length * dPPMM);
          seatpostEnd = {
            x: seatpostEndPoint.x,
            y: seatpostEndPoint.y,
            color: helperPointsColor,
          }
        }
      }

      const stack = sizeMeasures.stack;
      const reach = sizeMeasures.reach;
      if (stack && reach) {
        headTubeTop = {
          x: bottomBracketCenter.x + dPPMM * reach,
          y: bottomBracketCenter.y - dPPMM * stack,
          color: pointsColor,
        }
        const headAngle = sizeMeasures.headAngle;
        const headTube = sizeMeasures.headTube;
        const headAngleRadians = Math.PI * headAngle / 180;
        if (headAngle && headTube) {
          headTubeBottom = {
            x: headTubeTop.x + dPPMM * (Math.cos(headAngleRadians) * headTube),
            y: headTubeTop.y + dPPMM * (Math.sin(headAngleRadians) * headTube),
            color: pointsColor,
          }

          if (geometryContext.geometryPoints.topTube) {
            const topTubeRightPoint = findIntermediatePoint(headTubeTop, headTubeBottom, geometryContext.geometryPoints.topTube.rightOffset * dPPMM);
            topTubeRight = {
              x: topTubeRightPoint.x,
              y: topTubeRightPoint.y,
              color: helperPointsColor,
            }
          }

          if (geometryContext.geometryPoints.bottomTube) {
            const bottomTubeRightPoint = findIntermediatePoint(headTubeBottom, headTubeTop, geometryContext.geometryPoints.bottomTube.rightOffset * dPPMM);
            bottomTubeRight = {
              x: bottomTubeRightPoint.x,
              y: bottomTubeRightPoint.y,
              color: helperPointsColor,
            }
          }

          if (geometryContext.geometryPoints.headstack) {
            const spacersEndPoint = findIntermediatePoint(headTubeTop, headTubeBottom, -sizeMeasures.spacersStack * dPPMM);
            spacersEnd = {
              x: spacersEndPoint.x,
              y: spacersEndPoint.y,
              color: helperPointsColor,
            }
            if (geometryContext.geometryPoints.stem && sizeMeasures.stemLength) {
              const stemStartPoint = findIntermediatePoint(
                headTubeTop,
                headTubeBottom, 
                -(sizeMeasures.spacersStack + geometryContext.geometryPoints.stem.width/2) * dPPMM);
              stemStart = {
                x: stemStartPoint.x,
                y: stemStartPoint.y,
                color: helperPointsColor,
              }
              if (sizeMeasures.stemLength) {
                const trueAngle = sizeMeasures.stemAngle + sizeMeasures.headAngle - 90;
                console.log("trueAngle: ", trueAngle);
                const handlebarMountPoint = findPointFromPointAngleLength(stemStartPoint, trueAngle, sizeMeasures.stemLength * dPPMM);
                handlebarMount = {
                  x: handlebarMountPoint.x,
                  y: handlebarMountPoint.y,
                  color: helperPointsColor,
                }
              }
            }
          }
        }
      }
    }

    updateState({
      sizeGeometryPoints: {
        rearWheelCenter: rearWheelCenter,
        frontWheelCenter: frontWheelCenter,
        bottomBracketCenter: bottomBracketCenter,
        seatTubeTop: seatTubeTop,
        headTubeTop: headTubeTop,
        headTubeBottom: headTubeBottom,
        seatStayRight: seatStayRight,
        seatStayLeft: seatStayLeft,
        topTubeLeft: topTubeLeft,
        topTubeRight: topTubeRight,
        bottomTubeRight: bottomTubeRight,
        crankArmEnd: crankArmEnd,
        seatpostEnd: seatpostEnd,
        spacersEnd: spacersEnd,
        stemStart: stemStart,
        handlebarMount: handlebarMount,
      },
    });
  }, [sizeMeasures, desiredPxPerMM, geometryContext.geometryPoints]);

  return (
    <>
      {state && state.sizeGeometryPoints &&
        <GeometryPointVisualization pointsSet={state.sizeGeometryPoints}/>
      }
      {state && state.sizeGeometryPoints &&
        <BikeImageStitcher destinationPoints={state.sizeGeometryPoints} desiredPxPerMM={desiredPxPerMM}/>
      }
      {/* {state && state.sizeGeometryPoints && <GeometryPointVisualization pointsSet={geometryContext.geometryPoints}/>} */}
    </>
  );
};

export default GeometryPointsFromMeasures;
