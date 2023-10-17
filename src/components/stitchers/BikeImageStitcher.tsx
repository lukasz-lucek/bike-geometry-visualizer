import React, { useEffect, useState } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { ColorPoint2d, Point2d } from '../../interfaces/Point2d';
import { findIntermediatePoint, findPxPerMm } from '../../utils/GeometryUtils';
import CirclePartGrabber from '../grabbers/CirclePartGrabber';
import PertrudingPartGrabber from '../grabbers/PertrudingPartGrabber';
import RectanglePartGrabber from '../grabbers/RectanglePartGrabber';

export interface DestinationGeometryPoints {
  rearWheelCenter: ColorPoint2d | null;
  frontWheelCenter: ColorPoint2d | null;
  bottomBracketCenter: ColorPoint2d | null;
  seatTubeTop: ColorPoint2d | null;
  headTubeTop: ColorPoint2d | null;
  headTubeBottom: ColorPoint2d | null;
  seatStayRight: ColorPoint2d | null;
  seatStayLeft: ColorPoint2d | null;
  topTubeLeft: ColorPoint2d | null;
  topTubeRight: ColorPoint2d | null;
  bottomTubeRight: ColorPoint2d | null;
  crankArmEnd: ColorPoint2d | null;
  seatpostEnd: ColorPoint2d | null;
  spacersEnd: ColorPoint2d | null;
  stemStart: ColorPoint2d | null;
  handlebarMount: ColorPoint2d | null;
}

interface BikeImageStitcherProps {
  destinationPoints: DestinationGeometryPoints;
  desiredPxPerMM: number | null;
}

const BikeImageStitcher = ({ destinationPoints, desiredPxPerMM = null }: BikeImageStitcherProps) => {
  const {
    state: [geometryState,],
  } = useGeometryContext();

  const [pxPerMm, setPxPerMm] = useState<number | null>(null);
  const [stemStartPoint, setStemStartPoint] = useState<Point2d | null>(null);

  const dPPMM = desiredPxPerMM != null ? desiredPxPerMM : pxPerMm;

  useEffect(() => {
    const points = geometryState.geometryPoints;
    const semiFixedRectangles = geometryState.semiFixedRectangles;
    const fixedRectangles = geometryState.fixedRectangles;
    if (!points ||
      !points.rearWheelCenter ||
      !points.frontWheelCenter ||
      !geometryState.wheelbase) {
      return;
    }
    const pPMm = findPxPerMm(points.rearWheelCenter, points.frontWheelCenter, geometryState.wheelbase);
    if (!pPMm) {
      return;
    }
    setPxPerMm(pPMm);

    if (points.headTubeTop && points.headTubeBottom && semiFixedRectangles.headstack && fixedRectangles.stem) {
      const startPoint = findIntermediatePoint(
        points.headTubeTop,
        points.headTubeBottom,
        -(semiFixedRectangles.headstack.length + fixedRectangles.stem.width / 2) * pPMm);
      setStemStartPoint(startPoint);
    }
  }, [geometryState.geometryPoints, geometryState.wheelbase, destinationPoints]);

  return (
    <>
      {pxPerMm &&
        <div>
          {geometryState.fixedCircles.rearWheel && destinationPoints.rearWheelCenter &&
            <CirclePartGrabber
              radius={geometryState.fixedCircles.rearWheel.radius}
              centerPoint={geometryState.geometryPoints.rearWheelCenter}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              placementPoint={destinationPoints.rearWheelCenter}
              desiredPxPerMM={dPPMM}
              layer={3} />
          }

          {geometryState.fixedCircles.frontWheel && destinationPoints.frontWheelCenter &&
            <CirclePartGrabber
              radius={geometryState.fixedCircles.frontWheel.radius}
              centerPoint={geometryState.geometryPoints.frontWheelCenter}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              placementPoint={destinationPoints.frontWheelCenter}
              desiredPxPerMM={dPPMM}
              layer={3} />
          }

          {geometryState.fixedCircles.chainring && destinationPoints.bottomBracketCenter &&
            <CirclePartGrabber
              radius={geometryState.fixedCircles.chainring.radius}
              centerPoint={geometryState.geometryPoints.bottomBracketCenter}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              placementPoint={destinationPoints.bottomBracketCenter}
              desiredPxPerMM={dPPMM}
              layer={5} />
          }

          {geometryState.offsetFixedRectangles.chainstay && destinationPoints.bottomBracketCenter && destinationPoints.rearWheelCenter &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.chainstay.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.chainstay.rightOffset}
              width={geometryState.offsetFixedRectangles.chainstay.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.rearWheelCenter,
                bl: geometryState.geometryPoints.rearWheelCenter,
                tr: geometryState.geometryPoints.bottomBracketCenter,
                br: geometryState.geometryPoints.bottomBracketCenter,
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.rearWheelCenter}
              rightPlacementPoint={destinationPoints.bottomBracketCenter}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.offsetFixedRectangles.seatTube && destinationPoints.bottomBracketCenter && destinationPoints.seatTubeTop &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.seatTube.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.seatTube.rightOffset}
              width={geometryState.offsetFixedRectangles.seatTube.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.seatTubeTop,
                bl: geometryState.geometryPoints.seatTubeTop,
                tr: geometryState.geometryPoints.bottomBracketCenter,
                br: geometryState.geometryPoints.bottomBracketCenter
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.seatTubeTop}
              rightPlacementPoint={destinationPoints.bottomBracketCenter}
              desiredPxPerMM={dPPMM}
              layer={9} />
          }

          {geometryState.offsetFixedRectangles.seatstay && destinationPoints.seatStayLeft && destinationPoints.seatStayRight &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.seatstay.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.seatstay.rightOffset}
              width={geometryState.offsetFixedRectangles.seatstay.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.rearWheelCenter,
                bl: geometryState.geometryPoints.rearWheelCenter,
                tr: geometryState.geometryPoints.seatTubeTop,
                br: geometryState.geometryPoints.bottomBracketCenter
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.seatStayLeft}
              rightPlacementPoint={destinationPoints.seatStayRight}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.offsetFixedRectangles.topTube && destinationPoints.topTubeLeft && destinationPoints.topTubeRight &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.topTube.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.topTube.rightOffset}
              width={geometryState.offsetFixedRectangles.topTube.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.seatTubeTop,
                bl: geometryState.geometryPoints.bottomBracketCenter,
                tr: geometryState.geometryPoints.headTubeTop,
                br: geometryState.geometryPoints.headTubeBottom
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.topTubeLeft}
              rightPlacementPoint={destinationPoints.topTubeRight}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.offsetFixedRectangles.bottomTube && destinationPoints.bottomBracketCenter && destinationPoints.bottomTubeRight &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.bottomTube.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.bottomTube.rightOffset}
              width={geometryState.offsetFixedRectangles.bottomTube.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.bottomBracketCenter,
                bl: geometryState.geometryPoints.bottomBracketCenter,
                tr: geometryState.geometryPoints.headTubeBottom,
                br: geometryState.geometryPoints.headTubeTop
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.bottomBracketCenter}
              rightPlacementPoint={destinationPoints.bottomTubeRight}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.offsetFixedRectangles.bottomTube && destinationPoints.bottomBracketCenter && destinationPoints.bottomTubeRight &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.bottomTube.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.bottomTube.rightOffset}
              width={geometryState.offsetFixedRectangles.bottomTube.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.bottomBracketCenter,
                bl: geometryState.geometryPoints.bottomBracketCenter,
                tr: geometryState.geometryPoints.headTubeBottom,
                br: geometryState.geometryPoints.headTubeTop
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.bottomBracketCenter}
              rightPlacementPoint={destinationPoints.bottomTubeRight}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.offsetFixedRectangles.headTube && destinationPoints.headTubeTop && destinationPoints.headTubeBottom &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.headTube.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.headTube.rightOffset}
              width={geometryState.offsetFixedRectangles.headTube.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.headTubeTop,
                bl: geometryState.geometryPoints.headTubeTop,
                tr: geometryState.geometryPoints.headTubeBottom,
                br: geometryState.geometryPoints.headTubeBottom
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.headTubeTop}
              rightPlacementPoint={destinationPoints.headTubeBottom}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.offsetFixedRectangles.fork && destinationPoints.frontWheelCenter && destinationPoints.headTubeBottom &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.fork.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.fork.rightOffset}
              width={geometryState.offsetFixedRectangles.fork.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.headTubeBottom,
                bl: geometryState.geometryPoints.headTubeBottom,
                tr: geometryState.geometryPoints.frontWheelCenter,
                br: geometryState.geometryPoints.frontWheelCenter
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.headTubeBottom}
              rightPlacementPoint={destinationPoints.frontWheelCenter}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.offsetFixedRectangles.crankArm && destinationPoints.bottomBracketCenter && destinationPoints.crankArmEnd &&
            <RectanglePartGrabber
              leftOffset={geometryState.offsetFixedRectangles.crankArm.leftOffset}
              rightOffset={geometryState.offsetFixedRectangles.crankArm.rightOffset}
              width={geometryState.offsetFixedRectangles.crankArm.width}
              anchorPoints={{
                tl: geometryState.geometryPoints.bottomBracketCenter,
                bl: geometryState.geometryPoints.bottomBracketCenter,
                tr: geometryState.geometryPoints.crankArmEnd,
                br: geometryState.geometryPoints.crankArmEnd
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.bottomBracketCenter}
              rightPlacementPoint={destinationPoints.crankArmEnd}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.semiFixedRectangles.headstack && destinationPoints.headTubeTop && destinationPoints.headTubeBottom &&
            <PertrudingPartGrabber
              width={geometryState.semiFixedRectangles.headstack.width}
              length={geometryState.semiFixedRectangles.headstack.length}
              anchorPoints={{
                tl: geometryState.geometryPoints.headTubeTop,
                bl: geometryState.geometryPoints.headTubeBottom,
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.headTubeTop}
              rightPlacementPoint={destinationPoints.spacersEnd}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.semiFixedRectangles.seatpost && destinationPoints.seatTubeTop && destinationPoints.bottomBracketCenter &&
            <PertrudingPartGrabber
              width={geometryState.semiFixedRectangles.seatpost.width}
              length={geometryState.semiFixedRectangles.seatpost.length}
              anchorPoints={{
                tl: geometryState.geometryPoints.seatTubeTop,
                bl: geometryState.geometryPoints.bottomBracketCenter,
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.seatTubeTop}
              rightPlacementPoint={destinationPoints.seatpostEnd}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }

          {geometryState.fixedRectangles.stem && destinationPoints.stemStart && destinationPoints.handlebarMount &&
            <RectanglePartGrabber
              leftOffset={0}
              rightOffset={0}
              width={geometryState.fixedRectangles.stem.width}
              anchorPoints={{
                tl: stemStartPoint,
                bl: stemStartPoint,
                tr: geometryState.geometryPoints.handlebarMount,
                br: geometryState.geometryPoints.handlebarMount
              }}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              leftPlacementPoint={destinationPoints.stemStart}
              rightPlacementPoint={destinationPoints.handlebarMount}
              desiredPxPerMM={dPPMM}
              layer={7} />
          }
        </div>
      }
    </>
  );
};

export default BikeImageStitcher;
