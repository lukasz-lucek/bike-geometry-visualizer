import React, { useEffect, useState } from 'react';
import { GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { findPxPerMm, findIntermediatePoint, findPointFromPointAngleLength, findProjectionPointToLine, findDistance } from '../../utils/GeometryUtils';
import BikeImageStitcher, { DestinationGeometryPoints, defaultDestinationGeometryPoints } from './BikeImageStitcher';
import GeometryPointVisualization from '../drawing/GeometryPointsVisualization';
import Color from 'color';
import { ColorPoint2d } from '../../interfaces/Point2d';
import { HandlebarMeasures, Measures } from '../../contexts/MeasurementsContext';

const GeometryPointsFromMeasures = ({
  sizeMeasures,
  handlebarMeasurements,
  desiredPxPerMM = null,
  setDestinationGeometryPoints = undefined,
}: {
  sizeMeasures: Measures;
  handlebarMeasurements: HandlebarMeasures;
  desiredPxPerMM: number | null;
  setDestinationGeometryPoints: ((points: DestinationGeometryPoints) => void) | undefined;
}) => {

  const {
    state: [geometryContext,],
  } = useGeometryContext();

  const [state, updateState] = useState<DestinationGeometryPoints>(defaultDestinationGeometryPoints);

  useEffect(() => {
    const orgRearWheelCenter = geometryContext.geometryPoints?.rearWheelCenter;
    const orgFrontWheelCenter = geometryContext.geometryPoints?.frontWheelCenter;
    const orgWheelbase = geometryContext.wheelbase;

    const orgBottomBracketCenter = geometryContext.geometryPoints.bottomBracketCenter;
    const orgSeatTubeTop = geometryContext.geometryPoints.seatTubeTop;

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

    let bottomBracketCenter: ColorPoint2d | null = null;
    let seatTubeTop: ColorPoint2d | null = null;
    let headTubeTop: ColorPoint2d | null = null;
    let headTubeBottom: ColorPoint2d | null = null;
    let seatStayRight: ColorPoint2d | null = null;
    let seatStayLeft: ColorPoint2d | null = null;
    let topTubeLeft: ColorPoint2d | null = null;
    let topTubeRight: ColorPoint2d | null = null;
    let bottomTubeRight: ColorPoint2d | null = null;
    let crankArmEnd: ColorPoint2d | null = null;
    let seatpostEnd: ColorPoint2d | null = null;
    let seatpostStart: ColorPoint2d | null = null;
    let spacersEnd: ColorPoint2d | null = null;
    let stemStart: ColorPoint2d | null = null;
    let handlebarMount: ColorPoint2d | null = null;
    let seatMount: ColorPoint2d | null = null;

    const bb = sizeMeasures.bbDrop;
    const cs = sizeMeasures.chainstay;
    if (bb && cs) {

      const dx = Math.sqrt(cs * cs - bb * bb);
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
        if (geometryContext.offsetFixedRectangles.seatstay && orgSeatTubeTop && orgBottomBracketCenter) {
          const dist = findDistance(orgSeatTubeTop, orgBottomBracketCenter) / pxPerMm;
          const newDist = findDistance(seatTubeTop, bottomBracketCenter) / dPPMM;
          const correctionRatio =  newDist / dist;
          const seatStayRightPoint = findIntermediatePoint(bottomBracketCenter, seatTubeTop, correctionRatio * (dist - geometryContext.offsetFixedRectangles.seatstay.rightOffset) * dPPMM);
          seatStayRight = {
            x: seatStayRightPoint!.x,
            y: seatStayRightPoint!.y,
            color: helperPointsColor,
          }
          const rwcl = {
            x: rearWheelCenter.x,
            y: rearWheelCenter.y - 10,
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

        if (geometryContext.semiFixedRectangles.seatpost) {
          const seatpostEndPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, - sizeMeasures.seatpostExtension * dPPMM);
          seatpostEnd = {
            x: seatpostEndPoint!.x,
            y: seatpostEndPoint!.y,
            color: helperPointsColor,
          }
          if (sizeMeasures.seatpostExtension < geometryContext.semiFixedRectangles.seatpost.length) {
            const seatpostStartPoint = findIntermediatePoint(seatTubeTop, bottomBracketCenter, - (sizeMeasures.seatpostExtension - geometryContext.semiFixedRectangles.seatpost.length) * dPPMM);
            seatpostStart = {
              x: seatpostStartPoint!.x,
              y: seatpostStartPoint!.y,
              color: helperPointsColor,
            }
          } else {
            seatpostStart = seatTubeTop;
          }
          
          const orgSeatMount = geometryContext.geometryPoints.seatMount;
          if (orgSeatMount && orgSeatTubeTop && orgBottomBracketCenter) {
            let seatMountProjection = findProjectionPointToLine(orgBottomBracketCenter, orgSeatTubeTop, orgSeatMount);
            let orgDistance = findDistance(seatMountProjection, orgSeatTubeTop) / pxPerMm;
            let distance = orgDistance + (sizeMeasures.seatpostExtension - geometryContext.semiFixedRectangles.seatpost.length)
            const newSeatMountProjection = findIntermediatePoint(seatTubeTop, bottomBracketCenter, - distance * dPPMM);
            if (newSeatMountProjection) {
              const newSeatMount = findPointFromPointAngleLength(newSeatMountProjection, seatAngle+90, sizeMeasures.seatpostSetback * dPPMM)
              seatMount = {
                x: newSeatMount!.x,
                y: newSeatMount!.y,
                color: helperPointsColor,
              }
            }
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

          if (geometryContext.semiFixedRectangles.headstack) {
            const spacersEndPoint = findIntermediatePoint(headTubeTop, headTubeBottom, -sizeMeasures.spacersStack * dPPMM);
            spacersEnd = {
              x: spacersEndPoint!.x,
              y: spacersEndPoint!.y,
              color: helperPointsColor,
            }
            if (geometryContext.fixedRectangles.stem && sizeMeasures.stemLength) {
              const stemStartPoint = findIntermediatePoint(
                headTubeTop,
                headTubeBottom,
                -(sizeMeasures.spacersStack + geometryContext.fixedRectangles.stem.width / 2) * dPPMM);
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

    const newState : DestinationGeometryPoints = {
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
      seatpostStart: seatpostStart,
      spacersEnd: spacersEnd,
      stemStart: stemStart,
      handlebarMount: handlebarMount,
      seatMount: seatMount,
      // orgPxPerMM: pxPerMm,
      // desiredPxPerMM: desiredPxPerMM,
    };
    updateState(newState);
    if (setDestinationGeometryPoints) {
      setDestinationGeometryPoints(newState);
    }
  }, [sizeMeasures, desiredPxPerMM, geometryContext.geometryPoints, setDestinationGeometryPoints]);

  return (
    <>
      {state &&
        //TODO fix the unkonwn cast
        <GeometryPointVisualization pointsSet={state as unknown as GeometryPoints} />
      }
      {state &&
        <BikeImageStitcher destinationPoints={state} desiredPxPerMM={desiredPxPerMM} handlebarMeasurements={handlebarMeasurements} measures={sizeMeasures}/>
      }
      {/* {state && state.sizeGeometryPoints && <GeometryPointVisualization pointsSet={geometryContext.geometryPoints}/>} */}
    </>
  );
};

export default GeometryPointsFromMeasures;
