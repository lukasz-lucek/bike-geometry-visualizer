import React, { useEffect, useState } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { ColorPoint2d, Point2d } from '../../interfaces/Point2d';
import { findIntermediatePoint, findPxPerMm } from '../../utils/GeometryUtils';
import CirclePartGrabber from '../grabbers/CirclePartGrabber';
import PertrudingPartGrabber from '../grabbers/PertrudingPartGrabber';
import RectanglePartGrabber from '../grabbers/RectanglePartGrabber';
import HandlebarGrabber from '../grabbers/HandlebarGrabber';
import { HandlebarMeasures, Measures } from '../../contexts/MeasurementsContext';
import SeatGrabber from '../grabbers/SeatGrabber';

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
  seatpostStart: ColorPoint2d | null;
  spacersEnd: ColorPoint2d | null;
  stemStart: ColorPoint2d | null;
  handlebarMount: ColorPoint2d | null;
  seatMount: ColorPoint2d | null;
  // orgPxPerMM: number | null;
  // desiredPxPerMM: number | null;
}

export const defaultDestinationGeometryPoints : DestinationGeometryPoints = {
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
  seatpostStart: null,
  spacersEnd: null,
  stemStart: null,
  handlebarMount: null,
  seatMount: null,
  // orgPxPerMM: null,
  // desiredPxPerMM: null,
}

interface BikeImageStitcherProps {
  destinationPoints: DestinationGeometryPoints;
  desiredPxPerMM: number | null;
  measures: Measures;
  handlebarMeasurements: HandlebarMeasures;
}

const BikeImageStitcher = ({ destinationPoints, desiredPxPerMM = null, handlebarMeasurements, measures}: BikeImageStitcherProps) => {
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
              layer={7} />
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
              layer={5} />
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
              layer={5} />
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
              layer={8} />
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
              layer={5} />
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
              layer={7}
              margin={30} />
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
              layer={7} 
              margin={50}/>
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
              layer={8} 
              margin={10}/>
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
              leftPlacementPoint={destinationPoints.seatpostStart}
              rightPlacementPoint={destinationPoints.seatpostEnd}
              desiredPxPerMM={dPPMM}
              layer={3} />
          }

          {geometryState.fixedCircles.seatpostYoke && destinationPoints.seatMount &&
            <CirclePartGrabber
              radius={geometryState.fixedCircles.seatpostYoke.radius}
              centerPoint={geometryState.geometryPoints.seatMount}
              pxPerMm={pxPerMm}
              strokeWidth={0}
              placementPoint={destinationPoints.seatMount}
              desiredPxPerMM={dPPMM}
              layer={5} />
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
              layer={7} 
              margin={50}/>
          }

          {geometryState.handlebarGeometry && destinationPoints.handlebarMount &&
            <HandlebarGrabber
              geometry={geometryState.handlebarGeometry}
              raise={handlebarMeasurements.handlebarRaise}
              setback={handlebarMeasurements.handlebarSetback}
              reach={handlebarMeasurements.handlebarReach}
              drop={handlebarMeasurements.handlebarDrop}
              rotation={handlebarMeasurements.handlebarRotation}
              shiftersMountOffset={handlebarMeasurements.shiftersMountPoint}
              orgShifterMountOffset={geometryState.shifterMountOffset}
              shifterPolygon={geometryState.polygons.shifter}
              pxPerMm={pxPerMm}
              mountingPoint={destinationPoints.handlebarMount}
              desiredPxPerMM={dPPMM}
              layer={9} />
          }

          {geometryState.polygons.seat && destinationPoints.seatMount &&
            <SeatGrabber
              seatPolygon={geometryState.polygons.seat}
              seatRotation={measures.seatRotation}
              railsAngle={geometryState.seatRailAngle}
              seatSetback={measures.seatSetback}
              orgMountingPoint={geometryState.geometryPoints.seatMount}
              pxPerMm={pxPerMm}
              mountingPoint={destinationPoints.seatMount}
              desiredPxPerMM={dPPMM}
              layer={9} />
          }
        </div>
      }
    </>
  );
};

export default BikeImageStitcher;
