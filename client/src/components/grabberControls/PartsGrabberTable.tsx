// src/components/BikeGeometryTable.js
import React from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { findPxPerMm } from '../../utils/GeometryUtils';
import CirclePartGrabberControls from './CirclePartsGrabberControls';
import PertrudingPartGrabberControls from './PertrudingPartGrabberControls';
import RectanglePartGrabberControls from './RectanglePartGrabberControls';
import StemPartGrabberControls from './StemPartGrabberControls';

const PartsGrabberTable = () => {
  const {
    state: [geometryState,],
  } = useGeometryContext();

  const points = geometryState.geometryPoints;
  const pxPerMm = findPxPerMm(points.rearWheelCenter, points.frontWheelCenter, geometryState.wheelbase) ?? 0;

  return (
    <div>
      <div className="bike-geometry-table">
        <div>
          <RectanglePartGrabberControls partKey="topTube" anchorPoints={{
            tl: points.seatTubeTop,
            bl: points.bottomBracketCenter,
            tr: points.headTubeTop,
            br: points.headTubeBottom
          }}
            pxPerMm={pxPerMm}>
            Top Tube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="bottomTube" anchorPoints={{
            tl: points.bottomBracketCenter,
            bl: points.bottomBracketCenter,
            tr: points.headTubeBottom,
            br: points.headTubeTop
          }}
            pxPerMm={pxPerMm}>
            Bottom Tube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="headTube" anchorPoints={{
            tl: points.headTubeTop,
            bl: points.headTubeTop,
            tr: points.headTubeBottom,
            br: points.headTubeBottom
          }}
            pxPerMm={pxPerMm}>
            Head Tube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="seatTube" anchorPoints={{
            tl: points.seatTubeTop,
            bl: points.seatTubeTop,
            tr: points.bottomBracketCenter,
            br: points.bottomBracketCenter
          }}
            pxPerMm={pxPerMm}>
            Seat Tube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="fork" anchorPoints={{
            tl: points.headTubeBottom,
            bl: points.headTubeBottom,
            tr: points.frontWheelCenter,
            br: points.frontWheelCenter
          }}
            pxPerMm={pxPerMm}>
            Fork
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="chainstay" anchorPoints={{
            tl: points.rearWheelCenter,
            bl: points.rearWheelCenter,
            tr: points.bottomBracketCenter,
            br: points.bottomBracketCenter
          }}
            pxPerMm={pxPerMm}>
            Chainstay
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="seatstay" anchorPoints={{
            tl: points.rearWheelCenter,
            bl: points.rearWheelCenter,
            tr: points.seatTubeTop,
            br: points.bottomBracketCenter
          }}
            pxPerMm={pxPerMm}
            forceOffset={{
              left: true,
              right: false,
            }}>
            Seatstay
          </RectanglePartGrabberControls>
        </div>
        <div>
          <RectanglePartGrabberControls partKey="crankArm" anchorPoints={{
            tl: points.bottomBracketCenter,
            bl: points.bottomBracketCenter,
            tr: points.crankArmEnd,
            br: points.crankArmEnd
          }}
            pxPerMm={pxPerMm}>
            Crank Arm
          </RectanglePartGrabberControls>
          <CirclePartGrabberControls
            partKey="rearWheel"
            centerPoint={geometryState.geometryPoints.rearWheelCenter}
            pxPerMm={pxPerMm}
            pointKey="rearWheelCenter">
            Rear Wheel
          </CirclePartGrabberControls>
          <CirclePartGrabberControls
            partKey="frontWheel"
            centerPoint={geometryState.geometryPoints.frontWheelCenter}
            pxPerMm={pxPerMm}
            pointKey="frontWheelCenter">
            Front Wheel
          </CirclePartGrabberControls>
          <CirclePartGrabberControls
            partKey="chainring"
            centerPoint={geometryState.geometryPoints.bottomBracketCenter}
            pxPerMm={pxPerMm}
            pointKey="bottomBracketCenter">
            Chainring
          </CirclePartGrabberControls>
          <PertrudingPartGrabberControls
            partKey="seatpost"
            anchorPoints={{
              tl: geometryState.geometryPoints.seatTubeTop,
              bl: geometryState.geometryPoints.bottomBracketCenter
            }}
            pxPerMm={pxPerMm}
            lengthName="length"
            widthName="width">
            Seatpost
          </PertrudingPartGrabberControls>
          <PertrudingPartGrabberControls
            partKey="headstack"
            anchorPoints={{
              tl: geometryState.geometryPoints.headTubeTop,
              bl: geometryState.geometryPoints.headTubeBottom
            }}
            pxPerMm={pxPerMm}
            lengthName="height"
            widthName="width">
            Stem spacers
          </PertrudingPartGrabberControls>

          <StemPartGrabberControls
            partKey="stem"
            anchorPoints={{
              tl: geometryState.geometryPoints.headTubeTop,
              bl: geometryState.geometryPoints.headTubeBottom,
              tr: geometryState.geometryPoints.handlebarMount,
              offset: geometryState.semiFixedRectangles.headstack
            }}
            pxPerMm={pxPerMm}>
            Stem
          </StemPartGrabberControls>

          <CirclePartGrabberControls
            partKey="seatpostYoke"
            centerPoint={geometryState.geometryPoints.seatMount}
            pxPerMm={pxPerMm}
            pointKey={null}>
            Seatpost Yoke
          </CirclePartGrabberControls>

        </div>
      </div>
    </div>
  );
};

export default PartsGrabberTable;
