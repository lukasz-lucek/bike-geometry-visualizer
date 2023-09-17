// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';
import { findPxPerMm } from '../utils/GeometryUtils.js';
import CirclePartGrabberControls from './CirclePartsGrabberControls.js';
import PertrudingPartGrabberControls from './PertrudingPartGrabberControls.js';
import RectanglePartGrabberControls from './RectanglePartGrabberControls.js';
import StemPartGrabberControls from './StemPartGrabberControls.js';

const PartsGrabberSpecs = ({ points, wheelbase, updatePoints }) => {

  const pxPerMm = findPxPerMm(points["rearWheelCenter"], points["frontWheelCenter"], wheelbase)

  const strokeWidth = 3*pxPerMm;
  const visualizationColor = "red";

  const {
    state: [contextState, ],
  } = useCanvasContext(); 

  const defaultState = {
    highlightedElement : null,
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    const newState = {...state, ...newPartialState};
    setState( newState );
  }

  const getSeatpostEnd = () => {
    const seatTubeTop = points["seatTubeTop"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (seatTubeTop && bottomBracketCenter) {
      const ratio = Math.sqrt(
        Math.pow(seatTubeTop.x - bottomBracketCenter.x, 2) + Math.pow(seatTubeTop.y - bottomBracketCenter.y, 2)
        ) / (points.seatpostLength  * pxPerMm);
      return {
        x: seatTubeTop.x + (seatTubeTop.x - bottomBracketCenter.x) / ratio,
        y: seatTubeTop.y + (seatTubeTop.y - bottomBracketCenter.y) / ratio,
      }
    }
    return null;
  }

  const getSpacersEndPoint = () => {
    const headTubeTop = points["headTubeTop"];
    const headTubeBottom = points["headTubeBottom"];

    if (headTubeTop && headTubeBottom) {
      const ratio = Math.sqrt(
        Math.pow(headTubeTop.x - headTubeBottom.x, 2) + Math.pow(headTubeTop.y - headTubeBottom.y, 2)
        ) / (points.stemOffset  * pxPerMm);
      return {
        x: headTubeTop.x + (headTubeTop.x - headTubeBottom.x) / ratio,
        y: headTubeTop.y + (headTubeTop.y - headTubeBottom.y) / ratio,
      }
    }
    return null;
  }
  
  const hilightSeatpost = () => {
    const seatTubeTop = points["seatTubeTop"];
    const seatpostEnd = getSeatpostEnd();

    if (seatTubeTop && seatpostEnd) {
      contextState.addShapeVisualizationFunc("seatpostGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: seatTubeTop.x,
        y1: seatTubeTop.y,
        x2: seatpostEnd.x,
        y2: seatpostEnd.y,
        width: points.seatpostWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideSeatpost = () => {
    contextState.addShapeVisualizationFunc("seatpostGrab", null, visualizationColor);
  }

  const hilightStem = () => {
    const stemStart = getSpacersEndPoint();
    const stemEnd = points["handlebarMount"];

    if (stemStart && stemEnd) {
      contextState.addShapeVisualizationFunc("stemGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: stemStart.x,
        y1: stemStart.y,
        x2: stemEnd.x,
        y2: stemEnd.y,
        width: points.stemWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideStem = () => {
    contextState.addShapeVisualizationFunc("stemGrab", null, visualizationColor);
  }

  const hilightSpacers = () => {
    const headTubeTop = points["headTubeTop"];
    const spacersEnd = getSpacersEndPoint();

    if (headTubeTop && spacersEnd) {
      contextState.addShapeVisualizationFunc("spacersGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: headTubeTop.x,
        y1: headTubeTop.y,
        x2: spacersEnd.x,
        y2: spacersEnd.y,
        width: points.spacersWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideSpacers = () => {
    contextState.addShapeVisualizationFunc("spacersGrab", null, visualizationColor);
  }

  const hilightHandlebars = () => {
    const handlebarMount = points["handlebarMount"];

    if (handlebarMount) {
      contextState.addShapeVisualizationFunc("handlebarsGrab", {
        type: 'circle',
        strokeWidth: strokeWidth,
        x: handlebarMount.x,
        y: handlebarMount.y,
        radius: points.handlebarsRadius * pxPerMm,
        startAngle: -90,
        endAngle: 90
      }, visualizationColor);
    }
  }

  const hideHandlebars = () => {
    contextState.addShapeVisualizationFunc("handlebarsGrab", null, visualizationColor);
  }

  useEffect(() => {

    const defaultSeatPostLength = 350;
    const defaultSeatPostWidth = 300;
    const defaultStemOffset = 50;
    const defaultStemWidth = 45;
    const defaultSpacersWidth = 45;
    const defaultHandlebarsRadius = 200;

    if (points.seatpostLength == null) {
      updatePoints({seatpostLength: defaultSeatPostLength});
    }
    if (points.seatpostWidth == null) {
      updatePoints({seatpostWidth: defaultSeatPostWidth});
    }
    if (points.stemOffset == null) {
      updatePoints({stemOffset: defaultStemOffset});
    }
    if (points.stemWidth == null) {
      updatePoints({stemWidth: defaultStemWidth});
    }
    if (points.spacersWidth == null) {
      updatePoints({spacersWidth: defaultSpacersWidth});
    }
    if (points.handlebarsRadius == null) {
      updatePoints({handlebarsRadius: defaultHandlebarsRadius});
    }

    if (state.highlightedElement == 'seatpostGrab') {
      hilightSeatpost();
    } else {
      hideSeatpost();
    }

    if (state.highlightedElement == 'stemGrab' ||
        state.highlightedElement == 'stemOffset') {
      hilightStem();
    } else {
      hideStem();
    }

    if (state.highlightedElement == 'spacersGrab' ||
        state.highlightedElement == 'stemOffset') {
      hilightSpacers();
    } else {
      hideSpacers();
    }

    if (state.highlightedElement == 'handlebarsGrab') {
      hilightHandlebars();
    } else {
      hideHandlebars();
    }
    
  }, [contextState.addShapeVisualizationFunc, state, points, pxPerMm, updatePoints]);

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

        </div>

        {/* <table enabled={pxPerMm != 0}>
          <thead>
            <tr>
              <th>Spec</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr onMouseEnter={() => {updateState({highlightedElement: "wheelsGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>Wheel-Radius</td>
              <td>{ points.wheelsRadius?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({wheelsRadius: points.wheelsRadius + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({wheelsRadius: points.wheelsRadius - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "chainringGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>Chainring-Radius</td>
              <td>{ points.chainringRadius?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({chainringRadius: points.chainringRadius + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({chainringRadius: points.chainringRadius - 5})}}>-</button></td>
            </tr>
            
            <tr onMouseEnter={() => {updateState({highlightedElement: "seatpostGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>Seatpost-length</td>
              <td>{ points.seatpostLength?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({seatpostLength: points.seatpostLength + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({seatpostLength: points.seatpostLength - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "seatpostGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>Seatpost-width</td>
              <td>{ points.seatpostWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({seatpostWidth: points.seatpostWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({seatpostWidth: points.seatpostWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "stemOffset"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>stem-off</td>
              <td>{ points.stemOffset?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({stemOffset: points.stemOffset + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({stemOffset: points.stemOffset - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "stemGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>stem-w</td>
              <td>{ points.stemWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({stemWidth: points.stemWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({stemWidth: points.stemWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "spacersGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>spacers</td>
              <td>{ points.spacersWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({spacersWidth: points.spacersWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({spacersWidth: points.spacersWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "handlebarsGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>handlebars-size</td>
              <td>{ points.handlebarsRadius?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({handlebarsRadius: points.handlebarsRadius + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({handlebarsRadius: points.handlebarsRadius - 5})}}>-</button></td>
            </tr>

          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default PartsGrabberSpecs;
