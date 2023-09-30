// src/components/BikeGeometryTable.js
import React from 'react';
import { findPxPerMm } from '../utils/GeometryUtils.js';
import CirclePartGrabberControls from './CirclePartsGrabberControls.js';
import PertrudingPartGrabberControls from './PertrudingPartGrabberControls.js';
import RectanglePartGrabberControls from './RectanglePartGrabberControls.js';
import StemPartGrabberControls from './StemPartGrabberControls.js';

const PartsGrabberSpecs = ({ points, wheelbase, updatePoints }) => {

  const pxPerMm = findPxPerMm(points["rearWheelCenter"], points["frontWheelCenter"], wheelbase)

  return (
    <div>
      <div className="bike-geometry-table">
        <div>
          <RectanglePartGrabberControls partKey="topTube" anchorPoints={{
            tl: "seatTubeTop",
            bl: "bottomBracketCenter",
            tr: "headTubeTop",
            br: "headTubeBottom"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset : 20,
            rightOffset : 20,
            width: 50,
          }}>
            TopTube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="bottomTube" anchorPoints={{
            tl: "bottomBracketCenter",
            bl: "bottomBracketCenter",
            tr: "headTubeBottom",
            br: "headTubeTop"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset : 0,
            rightOffset : 20,
            width: 50,
          }}>
            BottomTube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="headTube" anchorPoints={{
            tl: "headTubeTop",
            bl: "headTubeTop",
            tr: "headTubeBottom",
            br: "headTubeBottom"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset : 0,
            rightOffset : 0,
            width: 50,
          }}>
            HeadTube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="seatTube" anchorPoints={{
            tl: "seatTubeTop",
            bl: "seatTubeTop",
            tr: "bottomBracketCenter",
            br: "bottomBracketCenter"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset : 0,
            rightOffset : 0,
            width: 50,
          }}>
            SeatTube
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="fork" anchorPoints={{
            tl: "headTubeBottom",
            bl: "headTubeBottom",
            tr: "frontWheelCenter",
            br: "frontWheelCenter"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset : 0,
            rightOffset : 0,
            width: 50,
          }}>
            Fork
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="chainstay" anchorPoints={{
            tl: "rearWheelCenter",
            bl: "rearWheelCenter",
            tr: "bottomBracketCenter",
            br: "bottomBracketCenter"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset : 0,
            rightOffset : 0,
            width: 30,
          }}>
            Chainstay
          </RectanglePartGrabberControls>

          <RectanglePartGrabberControls partKey="seatstay" anchorPoints={{
            tl: "rearWheelCenter",
            bl: "rearWheelCenter",
            tr: "seatTubeTop",
            br: "bottomBracketCenter"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset : 0,
            rightOffset : 30,
            width: 30,
          }}
          forceOffset={{
            left:true,
            right:false,
          }}>
            Seatstay
          </RectanglePartGrabberControls>
        </div>
        <div>
          <RectanglePartGrabberControls partKey="crankArm" anchorPoints={{
            tl: "bottomBracketCenter",
            bl: "bottomBracketCenter",
            tr: "crankArmEnd",
            br: "crankArmEnd"
          }}
          pxPerMm = {pxPerMm}
          defaultPartSetup={{
            leftOffset: 0,
            rightOffset: 0,
            width: 30,
          }}>
            CrankArm
          </RectanglePartGrabberControls>
          <CirclePartGrabberControls
            partKey="rearWheel"
            centerPoint="rearWheelCenter"
            pxPerMm = {pxPerMm}
            defaultPartSetup={{
              radius: 350,
            }}>
            RearWheel
          </CirclePartGrabberControls>
          <CirclePartGrabberControls
            partKey="frontWheel"
            centerPoint="frontWheelCenter"
            pxPerMm = {pxPerMm}
            defaultPartSetup={{
              radius: 350,
            }}>
            FrontWheel
          </CirclePartGrabberControls>
          <CirclePartGrabberControls
            partKey="chainring"
            centerPoint="bottomBracketCenter"
            pxPerMm = {pxPerMm}
            defaultPartSetup={{
              radius: 100,
            }}>
            Chainring
          </CirclePartGrabberControls>
          <PertrudingPartGrabberControls
            partKey="seatpost"
            anchorPoints={{
              tl: "seatTubeTop",
              bl: "bottomBracketCenter"
            }}
            pxPerMm = {pxPerMm}
            lengthName = "length"
            widthName = "width"
            defaultPartSetup={{
              length : 100,
              width : 30,
            }}>
            Seatpost
          </PertrudingPartGrabberControls>
          <PertrudingPartGrabberControls
            partKey="headstack"
            anchorPoints={{
              tl: "headTubeTop",
              bl: "headTubeBottom"
            }}
            pxPerMm = {pxPerMm}
            lengthName = "height"
            widthName = "width"
            defaultPartSetup={{
              length : 40,
              width : 40,
            }}>
            Stem spacers
          </PertrudingPartGrabberControls>

          <StemPartGrabberControls
            partKey="stem"
            anchorPoints={{
              tl: "headTubeTop",
              bl: "headTubeBottom",
              tr: "handlebarMount",
              offset: "headstack"
            }}
            pxPerMm = {pxPerMm}
            defaultPartSetup={{
              width: 40,
            }}>
            Stem
          </StemPartGrabberControls>

          <CirclePartGrabberControls
            partKey="seatpostYoke"
            centerPoint="seatMount"
            pxPerMm = {pxPerMm}
            defaultPartSetup={{
              radius: 30,
            }}>
            Seatpost Yoke
          </CirclePartGrabberControls>

        </div>
      </div>
    </div>
  );
};

export default PartsGrabberSpecs;
