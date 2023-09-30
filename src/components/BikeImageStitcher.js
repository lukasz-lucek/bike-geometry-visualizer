// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useGeometryContext } from '../contexts/GeometryContext';
import { findIntermediatePoint, findPxPerMm } from '../utils/GeometryUtils';
import CirclePartGrabber from './CirclePartGrabber.js';
import PertrudingPartGrabber from './PertrudingPartGrabber.js';
import RectanglePartGrabber from './RectanglePartGrabber.js';

const BikeImageStitcher = ({destinationPoints, desiredPxPerMM=null}) => {
  const {
    state: [geometryState, ],
  } = useGeometryContext();

  const [pxPerMm, setPxPerMm] = useState(null);
  const [stemStartPoint, setStemStartPoint] = useState(null);

  const dPPMM = desiredPxPerMM != null ? desiredPxPerMM : pxPerMm;

  useEffect(() => {
    const points = geometryState.geometryPoints;
    if (!points ||
        !points.rearWheelCenter ||
        !points.frontWheelCenter ||
        !geometryState.wheelbase)
    {
      return;
    }
    const pPMm = findPxPerMm(points.rearWheelCenter, points.frontWheelCenter, geometryState.wheelbase);
    setPxPerMm(pPMm);

    if (points.headTubeTop && points.headTubeBottom && points.headstack && points.stem) {
      const startPoint = findIntermediatePoint(
        points.headTubeTop,
        points.headTubeBottom,
        -(points.headstack.length + points.stem.width/2)  * pPMm);
      setStemStartPoint(startPoint);
    }
  }, [geometryState.geometryPoints, geometryState.wheelbase, destinationPoints]);

  return (
    <>
    {pxPerMm &&
    <div>
      {geometryState.geometryPoints.rearWheel && destinationPoints.rearWheelCenter &&
      <CirclePartGrabber
        radius = {geometryState.geometryPoints.rearWheel.radius}
        centerPoint = {"rearWheelCenter"}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        placementPoint = {destinationPoints.rearWheelCenter}
        desiredPxPerMM = {dPPMM}
        layer={3}/>
      }
      
      {geometryState.geometryPoints.frontWheel && destinationPoints.frontWheelCenter &&
      <CirclePartGrabber
        radius = {geometryState.geometryPoints.frontWheel.radius}
        centerPoint = {"frontWheelCenter"}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        placementPoint = {destinationPoints.frontWheelCenter}
        desiredPxPerMM = {dPPMM}
        layer={3}/>
      }

      {geometryState.geometryPoints.chainring && destinationPoints.bottomBracketCenter &&
      <CirclePartGrabber
        radius = {geometryState.geometryPoints.chainring.radius}
        centerPoint = {"bottomBracketCenter"}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        placementPoint = {destinationPoints.bottomBracketCenter}
        desiredPxPerMM = {dPPMM}
        layer={5}/>
      }

      {geometryState.geometryPoints.chainstay && destinationPoints.bottomBracketCenter && destinationPoints.rearWheelCenter &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.chainstay.leftOffset} 
        rightOffset = {geometryState.geometryPoints.chainstay.rightOffset} 
        width = {geometryState.geometryPoints.chainstay.width}
        anchorPoints = {{
          tl: "rearWheelCenter",
          bl: "rearWheelCenter",
          tr: "bottomBracketCenter",
          br: "bottomBracketCenter",
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.rearWheelCenter}
        rightPlacementPoint = {destinationPoints.bottomBracketCenter}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.seatTube && destinationPoints.bottomBracketCenter && destinationPoints.seatTubeTop &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.seatTube.leftOffset} 
        rightOffset = {geometryState.geometryPoints.seatTube.rightOffset} 
        width = {geometryState.geometryPoints.seatTube.width}
        anchorPoints = {{
          tl: "seatTubeTop",
          bl: "seatTubeTop",
          tr: "bottomBracketCenter",
          br: "bottomBracketCenter"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.seatTubeTop}
        rightPlacementPoint = {destinationPoints.bottomBracketCenter}
        desiredPxPerMM = {dPPMM}
        layer={9}/>
      }

      {geometryState.geometryPoints.seatstay && destinationPoints.seatStayLeft && destinationPoints.seatStayRight &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.seatstay.leftOffset} 
        rightOffset = {geometryState.geometryPoints.seatstay.rightOffset} 
        width = {geometryState.geometryPoints.seatstay.width}
        anchorPoints={{
          tl: "rearWheelCenter",
          bl: "rearWheelCenter",
          tr: "seatTubeTop",
          br: "bottomBracketCenter"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.seatStayLeft}
        rightPlacementPoint = {destinationPoints.seatStayRight}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.topTube && destinationPoints.topTubeLeft && destinationPoints.topTubeRight &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.topTube.leftOffset} 
        rightOffset = {geometryState.geometryPoints.topTube.rightOffset} 
        width = {geometryState.geometryPoints.topTube.width}
        anchorPoints={{
          tl: "seatTubeTop",
          bl: "bottomBracketCenter",
          tr: "headTubeTop",
          br: "headTubeBottom"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.topTubeLeft}
        rightPlacementPoint = {destinationPoints.topTubeRight}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.bottomTube && destinationPoints.bottomBracketCenter && destinationPoints.bottomTubeRight &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.bottomTube.leftOffset} 
        rightOffset = {geometryState.geometryPoints.bottomTube.rightOffset} 
        width = {geometryState.geometryPoints.bottomTube.width}
        anchorPoints={{
          tl: "bottomBracketCenter",
          bl: "bottomBracketCenter",
          tr: "headTubeBottom",
          br: "headTubeTop"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.bottomBracketCenter}
        rightPlacementPoint = {destinationPoints.bottomTubeRight}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.bottomTube && destinationPoints.bottomBracketCenter && destinationPoints.bottomTubeRight &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.bottomTube.leftOffset} 
        rightOffset = {geometryState.geometryPoints.bottomTube.rightOffset} 
        width = {geometryState.geometryPoints.bottomTube.width}
        anchorPoints={{
          tl: "bottomBracketCenter",
          bl: "bottomBracketCenter",
          tr: "headTubeBottom",
          br: "headTubeTop"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.bottomBracketCenter}
        rightPlacementPoint = {destinationPoints.bottomTubeRight}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.headTube && destinationPoints.headTubeTop && destinationPoints.headTubeBottom &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.headTube.leftOffset} 
        rightOffset = {geometryState.geometryPoints.headTube.rightOffset} 
        width = {geometryState.geometryPoints.headTube.width}
        anchorPoints={{
          tl: "headTubeTop",
          bl: "headTubeTop",
          tr: "headTubeBottom",
          br: "headTubeBottom"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.headTubeTop}
        rightPlacementPoint = {destinationPoints.headTubeBottom}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.fork && destinationPoints.frontWheelCenter && destinationPoints.headTubeBottom &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.fork.leftOffset} 
        rightOffset = {geometryState.geometryPoints.fork.rightOffset} 
        width = {geometryState.geometryPoints.fork.width}
        anchorPoints={{
          tl: "headTubeBottom",
          bl: "headTubeBottom",
          tr: "frontWheelCenter",
          br: "frontWheelCenter"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.headTubeBottom}
        rightPlacementPoint = {destinationPoints.frontWheelCenter}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.crankArm && destinationPoints.bottomBracketCenter && destinationPoints.crankArmEnd &&
      <RectanglePartGrabber 
        leftOffset = {geometryState.geometryPoints.crankArm.leftOffset} 
        rightOffset = {geometryState.geometryPoints.crankArm.rightOffset} 
        width = {geometryState.geometryPoints.crankArm.width}
        anchorPoints={{
          tl: "bottomBracketCenter",
          bl: "bottomBracketCenter",
          tr: "crankArmEnd",
          br: "crankArmEnd"
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.bottomBracketCenter}
        rightPlacementPoint = {destinationPoints.crankArmEnd}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.headstack && destinationPoints.headTubeTop && destinationPoints.headTubeBottom &&
      <PertrudingPartGrabber 
        width = {geometryState.geometryPoints.headstack.width}
        length = {geometryState.geometryPoints.headstack.length}
        anchorPoints={{
          tl: "headTubeTop",
          bl: "headTubeBottom",
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.headTubeTop}
        rightPlacementPoint = {destinationPoints.spacersEnd}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }

      {geometryState.geometryPoints.seatpost && destinationPoints.seatTubeTop && destinationPoints.bottomBracketCenter &&
      <PertrudingPartGrabber 
        width = {geometryState.geometryPoints.seatpost.width}
        length = {geometryState.geometryPoints.seatpost.length}
        anchorPoints={{
          tl: "seatTubeTop",
          bl: "bottomBracketCenter",
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.seatTubeTop}
        rightPlacementPoint = {destinationPoints.seatpostEnd}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      } 

      {geometryState.geometryPoints.stem && destinationPoints.stemStart && destinationPoints.handlebarMount &&
      <RectanglePartGrabber 
        leftOffset = {0} 
        rightOffset = {0} 
        width = {geometryState.geometryPoints.stem.width}
        anchorPoints={null}
        overridePoints = {{
          leftOffsetPoint : stemStartPoint,
          rightOffsetPoint : geometryState.geometryPoints.handlebarMount,
        }}
        pxPerMm = {pxPerMm}
        strokeWidth = {0}
        leftPlacementPoint = {destinationPoints.stemStart}
        rightPlacementPoint = {destinationPoints.handlebarMount}
        desiredPxPerMM = {dPPMM}
        layer={7}/>
      }
    </div>
    }
    </>
  );
};

export default BikeImageStitcher;
