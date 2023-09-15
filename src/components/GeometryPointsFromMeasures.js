// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useGeometryContext } from '../contexts/GeometryContext.js';
import { findPxPerMm } from '../utils/GeometryUtils.js';
import GeometryPointVisualization from './GeometryPointsVisualization.js';

const GeometryPointsFromMeasures = ({ sizeMeasures, desiredPxPerMM}) => {
  const {
    state: [geometryContext, ],
  } = useGeometryContext();

  const [state, updateState] = useState();

  useEffect(() => {
    const orgRearWheelCenter = geometryContext.geometryPoints?.rearWheelCenter;
    const orgFrontWheelCenter = geometryContext.geometryPoints?.frontWheelCenter;
    const orgWheelbase = geometryContext.wheelbase;

    const pointsColor = "red";

    if (!orgRearWheelCenter || !orgFrontWheelCenter || !orgWheelbase) {
      return;
    }
    const pxPerMm = findPxPerMm(orgRearWheelCenter, orgFrontWheelCenter, orgWheelbase);

    const rearWheelCenter = {
      x: desiredPxPerMM * orgRearWheelCenter.x / pxPerMm,
      y: desiredPxPerMM * orgRearWheelCenter.y / pxPerMm,
      color: pointsColor,
    }

    let frontWheelCenter = null;
    if (sizeMeasures.wheelbase) {
      frontWheelCenter = {
        x: desiredPxPerMM * ((orgRearWheelCenter.x / pxPerMm) + sizeMeasures.wheelbase),
        y: desiredPxPerMM * orgRearWheelCenter.y / pxPerMm,
        color: pointsColor,
      }
    }

    let bottomBracketCenter = null;
    let seatTubeTop = null;
    let headTubeTop = null;
    let headTubeBottom = null;

    const bb = sizeMeasures.bbDrop;
    const cs = sizeMeasures.chainstay;
    if (bb && cs) {
      
      const dx = Math.sqrt(cs*cs - bb*bb);
      bottomBracketCenter = {
        x: desiredPxPerMM * ((orgRearWheelCenter.x / pxPerMm) + dx),
        y: desiredPxPerMM * ((orgRearWheelCenter.y / pxPerMm) + bb),
        color: pointsColor,
      }

      const seatAngle = sizeMeasures.seatAngle;
      const seatTubeCT = sizeMeasures.seatTubeCT;
      const seatAngleRadians = Math.PI * seatAngle / 180;
      if (seatAngle && seatTubeCT) {
        seatTubeTop = {
          x: bottomBracketCenter.x - desiredPxPerMM * (Math.cos(seatAngleRadians) * seatTubeCT),
          y: bottomBracketCenter.y - desiredPxPerMM * (Math.sin(seatAngleRadians) * seatTubeCT),
          color: pointsColor,
        }
      }

      const stack = sizeMeasures.stack;
      const reach = sizeMeasures.reach;
      if (stack && reach) {
        headTubeTop = {
          x: bottomBracketCenter.x + desiredPxPerMM * reach,
          y: bottomBracketCenter.x - desiredPxPerMM * stack,
          color: pointsColor,
        }
      }

      const headAngle = sizeMeasures.headAngle;
      const headTube = sizeMeasures.headTube;
      const headAngleRadians = Math.PI * seatAngle / 180;
      if (headAngle && headTube) {
        headTubeBottom = {
          x: headTubeTop.x + desiredPxPerMM * (Math.cos(headAngleRadians) * headTube),
          y: headTubeTop.y + desiredPxPerMM * (Math.sin(headAngleRadians) * headTube),
          color: pointsColor,
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
      },
    });
  }, [sizeMeasures, desiredPxPerMM, geometryContext.geometryPoints]);

  return (
    <>
      {state && state.sizeGeometryPoints && <GeometryPointVisualization pointsSet={state.sizeGeometryPoints}/>}
    </>
  );
};

export default GeometryPointsFromMeasures;
