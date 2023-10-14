import React, {useEffect, useState} from 'react';
import { GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { findPxPerMm, findIntermediatePoint, findPointFromPointAngleLength} from '../../utils/GeometryUtils';
import BikeImageStitcher, { DestinationGeometryPoints } from './BikeImageStitcher';
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';
import Color from 'color';
import { ColorPoint2d } from '../../interfaces/Point2d';
import { Measures } from '../../contexts/MeasurementsContext';

const GeometryPointsFromMeasures = ({
  sizeMeasures,
  desiredPxPerMM=null
} : {
  sizeMeasures : Measures;
  desiredPxPerMM : number | null;
}) => {
  
  const {
    state: [geometryContext, ],
  } = useGeometryContext();

  const [state, updateState] = useState<DestinationGeometryPoints>({
    rearWheelCenter: null,
    frontWheelCenter: null,
    bottomBracketCenter: null,
    seatTubeTop: null,
    headTubeTop: null,
    headTubeBottom: null,
    seatStayRight: null,
    seatStayLeft: null,
    topTubeLeft: null,
    topTubeRight: null,
    bottomTubeRight: null,
    crankArmEnd: null,
    seatpostEnd: null,
    spacersEnd: null,
    stemStart: null,
    handlebarMount: null,
  });

  useEffect(() => {
    const orgRearWheelCenter = geometryContext.geometryPoints?.rearWheelCenter;
    const orgFrontWheelCenter = geometryContext.geometryPoints?.frontWheelCenter;
    const orgWheelbase = geometryContext.wheelbase;

    const pointsColor = Color("red");
    const helperPointsColor = Color("blue");

    if (!orgRearWheelCenter || !orgFrontWheelCenter || !orgWheelbase) {
      return;
    }
    const pxPerMm = findPxPerMm(orgRearWheelCenter, orgFrontWheelCenter, orgWheelbase);
    if (!pxPerMm) {
      return;
    }
    let dPPMM = pxPerMm;
    if (desiredPxPerMM) {
      dPPMM = desiredPxPerMM;
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

    let bottomBracketCenter : ColorPoint2d | null = null;
    let seatTubeTop : ColorPoint2d | null = null;
    let headTubeTop : ColorPoint2d | null = null;
    let headTubeBottom : ColorPoint2d | null = null;
    let seatStayRight : ColorPoint2d | null = null;
    let seatStayLeft : ColorPoint2d | null = null;
    let topTubeLeft : ColorPoint2d | null = null;
    let topTubeRight : ColorPoint2d | null = null;
    let bottomTubeRight : ColorPoint2d | null = null;
    let crankArmEnd : ColorPoint2d | null = null;
    let seatpostEnd : ColorPoint2d | null = null;
    let spacersEnd : ColorPoint2d | null = null;
    let stemStart : ColorPoint2d | null = null;
    let handlebarMount : ColorPoint2d | null = null;

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
        if (geometryContext.offsetFixedRectangles.seatstay) {
          const seatStayRightPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, geometryContext.offsetFixedRectangles.seatstay.rightOffset * dPPMM);
          seatStayRight = {
            x: seatStayRightPoint!.x,
            y: seatStayRightPoint!.y,
            color: helperPointsColor,
          }
          const rwcl = {
            x:rearWheelCenter.x,
            y:rearWheelCenter.y-10,
          }
          const seatStayLeftPoint = findIntermediatePoint(rearWheelCenter, rwcl, geometryContext.offsetFixedRectangles.seatstay.leftOffset * dPPMM);
          seatStayLeft = {
            x: seatStayLeftPoint!.x,
            y: seatStayLeftPoint!.y,
            color: helperPointsColor,
          }
        }
        if (geometryContext.offsetFixedRectangles.topTube) {
          const topTubeLeftPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, geometryContext.offsetFixedRectangles.topTube.leftOffset * dPPMM);
          topTubeLeft = {
            x: topTubeLeftPoint!.x,
            y: topTubeLeftPoint!.y,
            color: helperPointsColor,
          }
        }

        if (geometryContext.geometryPoints.crankArmEnd) {
          const crankArmEndPoint = findIntermediatePoint(bottomBracketCenter, seatTubeTop, - sizeMeasures.crankArm * dPPMM);
          crankArmEnd = {
            x: crankArmEndPoint!.x,
            y: crankArmEndPoint!.y,
            color: helperPointsColor,
          }
        }

        if (geometryContext.geometryPoints.seatpost) {
          const seatpostEndPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, - geometryContext.geometryPoints.seatpost.length * dPPMM);
          seatpostEnd = {
            x: seatpostEndPoint!.x,
            y: seatpostEndPoint!.y,
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

          if (geometryContext.offsetFixedRectangles.topTube) {
            const topTubeRightPoint = findIntermediatePoint(headTubeTop, headTubeBottom, geometryContext.offsetFixedRectangles.topTube.rightOffset * dPPMM);
            topTubeRight = {
              x: topTubeRightPoint!.x,
              y: topTubeRightPoint!.y,
              color: helperPointsColor,
            }
          }

          if (geometryContext.offsetFixedRectangles.bottomTube) {
            const bottomTubeRightPoint = findIntermediatePoint(headTubeBottom, headTubeTop, geometryContext.offsetFixedRectangles.bottomTube.rightOffset * dPPMM);
            bottomTubeRight = {
              x: bottomTubeRightPoint!.x,
              y: bottomTubeRightPoint!.y,
              color: helperPointsColor,
            }
          }

          if (geometryContext.geometryPoints.headstack) {
            const spacersEndPoint = findIntermediatePoint(headTubeTop, headTubeBottom, -sizeMeasures.spacersStack * dPPMM);
            spacersEnd = {
              x: spacersEndPoint!.x,
              y: spacersEndPoint!.y,
              color: helperPointsColor,
            }
            if (geometryContext.geometryPoints.stem && sizeMeasures.stemLength) {
              const stemStartPoint = findIntermediatePoint(
                headTubeTop,
                headTubeBottom, 
                -(sizeMeasures.spacersStack + geometryContext.geometryPoints.stem.width/2) * dPPMM);
              stemStart = {
                x: stemStartPoint!.x,
                y: stemStartPoint!.y,
                color: helperPointsColor,
              }
              if (sizeMeasures.stemLength) {
                const trueAngle = sizeMeasures.stemAngle + sizeMeasures.headAngle - 90;
                const handlebarMountPoint = findPointFromPointAngleLength(stemStartPoint!, trueAngle, sizeMeasures.stemLength * dPPMM);
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
    });
  }, [sizeMeasures, desiredPxPerMM, geometryContext.geometryPoints]);

  return (
    <>
      {state &&
        //TODO fix the unkonwn cast
        <GeometryPointVisualization pointsSet={state as unknown as GeometryPoints}/>
      }
      {state &&
        <BikeImageStitcher destinationPoints={state} desiredPxPerMM={desiredPxPerMM}/>
      }
      {/* {state && state.sizeGeometryPoints && <GeometryPointVisualization pointsSet={geometryContext.geometryPoints}/>} */}
    </>
  );
};

export default GeometryPointsFromMeasures;
