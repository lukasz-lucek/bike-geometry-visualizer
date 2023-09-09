// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';
import { findPxPerMm } from '../utils/GeometryUtils.js';
import './BikeGeometryTable.css'; // Import the CSS file

const BikeGeometryTable = ({ points, wheelbase, children }) => {

  const {
    state: [contextState, ],
  } = useCanvasContext(); 

  const defaultState = {
    highlightedElement : null
  }

  const [state, setState] = useState(defaultState);

  const updateState = (newPartialState) => {
    const newState = {...state, ...newPartialState};
    setState( newState );
  }

  const visualizationColor = "red";

  // Calculate bike geometry specs based on the provided points and wheelbase
  const finalWheelbase=wheelbase ? Number(wheelbase) : 0;

  let stack=0;
  let reach=0;
  let topTube=0;
  let seatTubeCT=0;
  let headAngle=0;
  let seatAngle=0;
  let headTube=0;
  let chainstay=0;
  let bbDrop=0;
  let pxPerMm=0;
  let strokeWidth=5;

  const rearWheelCenter = points["rearWheelCenter"];
  const frontWheelCenter = points["frontWheelCenter"];

  if (rearWheelCenter && frontWheelCenter) {
    pxPerMm = findPxPerMm(rearWheelCenter, frontWheelCenter, wheelbase)
    strokeWidth = strokeWidth*pxPerMm;

    const bottomBracketCenter = points["bottomBracketCenter"];
    const headTubeTop = points["headTubeTop"];
    const seatTubeTop = points["seatTubeTop"];
    const headTubeBottom = points["headTubeBottom"];

    if (bottomBracketCenter && headTubeTop) {
        stack = Math.abs(headTubeTop.y - bottomBracketCenter.y) / pxPerMm;
        reach = Math.abs(headTubeTop.x - bottomBracketCenter.x) / pxPerMm;
    }

    if (seatTubeTop && bottomBracketCenter) {
        seatTubeCT = Math.sqrt(Math.pow(bottomBracketCenter.x - seatTubeTop.x, 2) + Math.pow(bottomBracketCenter.y - seatTubeTop.y, 2)) / pxPerMm;
        const seatAngleRad = Math.atan2(Math.abs(seatTubeTop.y-bottomBracketCenter.y), Math.abs(seatTubeTop.x - bottomBracketCenter.x));
        seatAngle = (seatAngleRad * 180) / Math.PI;
        
        if (headTubeTop) {
            const seatAngleRadTo90 = (Math.PI / 2.0) - seatAngleRad;
            topTube = reach + Math.tan(seatAngleRadTo90) * stack;
        }
    }
    
    if (headTubeBottom && headTubeTop) {
        headTube = Math.sqrt(Math.pow(headTubeBottom.x - headTubeTop.x, 2) + Math.pow(headTubeBottom.y - headTubeTop.y, 2)) / pxPerMm;
        headAngle = (Math.atan2(Math.abs(headTubeTop.y-headTubeBottom.y), Math.abs(headTubeTop.x - headTubeBottom.x)) * 180) / Math.PI;
    }

    if (bottomBracketCenter && rearWheelCenter) {
        chainstay = Math.sqrt(Math.pow(bottomBracketCenter.x - rearWheelCenter.x, 2) + Math.pow(bottomBracketCenter.y - rearWheelCenter.y, 2)) / pxPerMm;
        bbDrop = Math.abs(bottomBracketCenter.y - rearWheelCenter.y) / pxPerMm;
    }
  }

  const hilightWheelbase = () => {
    const rearWheelCenter = points["rearWheelCenter"];
    const frontWheelCenter = points["frontWheelCenter"];

    if (rearWheelCenter && frontWheelCenter) {
      contextState.addShapeVisualizationFunc("rearWheelLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: rearWheelCenter.x,
        y1: rearWheelCenter.y,
        x2: frontWheelCenter.x,
        y2: rearWheelCenter.y
      }, visualizationColor);
    }
  }

  const hideWheelbase = () => {
    contextState.addShapeVisualizationFunc("rearWheelLine", null, visualizationColor);
    contextState.addShapeVisualizationFunc("frontWheelLine", null, visualizationColor);
  }

  const hilightChainstay = () => {
    const rearWheelCenter = points["rearWheelCenter"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (rearWheelCenter && bottomBracketCenter) {
      contextState.addShapeVisualizationFunc("chainstayLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: rearWheelCenter.x,
        y1: rearWheelCenter.y,
        x2: bottomBracketCenter.x,
        y2: bottomBracketCenter.y
      }, visualizationColor);
    }
  }

  const hideChainstay = () => {
    contextState.addShapeVisualizationFunc("chainstayLine", null, visualizationColor);
  }

  const hilightHeadTube = () => {
    const headTubeTop = points["headTubeTop"];
    const headTubeBottom = points["headTubeBottom"];

    if (headTubeTop && headTubeBottom) {
      contextState.addShapeVisualizationFunc("headTubeLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: headTubeTop.x,
        y1: headTubeTop.y,
        x2: headTubeBottom.x,
        y2: headTubeBottom.y
      }, visualizationColor);
    }
  }

  const hideHeadTube = () => {
    contextState.addShapeVisualizationFunc("headTubeLine", null, visualizationColor);
  }

  const hilightSeatTube = () => {
    const seatTubeTop = points["seatTubeTop"];
    const seatTubeBottom = points["bottomBracketCenter"];

    if (seatTubeTop && seatTubeBottom) {
      contextState.addShapeVisualizationFunc("seatTubeLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: seatTubeTop.x,
        y1: seatTubeTop.y,
        x2: seatTubeBottom.x,
        y2: seatTubeBottom.y
      }, visualizationColor);
    }
  }

  const hideSeatTube = () => {
    contextState.addShapeVisualizationFunc("seatTubeLine", null, visualizationColor);
  }

  const hilightTopTubeEffective = () => {
    const headTubeTop = points["headTubeTop"];

    if (headTubeTop && pxPerMm > 0 && topTube) {
      contextState.addShapeVisualizationFunc("topTubeEffectiveLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: headTubeTop.x,
        y1: headTubeTop.y,
        x2: headTubeTop.x - topTube * pxPerMm,
        y2: headTubeTop.y
      }, visualizationColor);
    }
  }

  const hideTopTubeEffective = () => {
    contextState.addShapeVisualizationFunc("topTubeEffectiveLine", null, visualizationColor);
  }

  const hilightStack = () => {
    const headTubeTop = points["headTubeTop"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (headTubeTop && bottomBracketCenter) {
      contextState.addShapeVisualizationFunc("stackLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: bottomBracketCenter.x,
        y1: bottomBracketCenter.y,
        x2: bottomBracketCenter.x,
        y2: headTubeTop.y
      }, visualizationColor);
    }
  }

  const hideStack = () => {
    contextState.addShapeVisualizationFunc("stackLine", null, visualizationColor);
  }

  const hilightReach = () => {
    const headTubeTop = points["headTubeTop"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (headTubeTop && bottomBracketCenter) {
      contextState.addShapeVisualizationFunc("reachLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: headTubeTop.x,
        y1: headTubeTop.y,
        x2: bottomBracketCenter.x,
        y2: headTubeTop.y
      }, visualizationColor);
    }
  }

  const hideReach = () => {
    contextState.addShapeVisualizationFunc("reachLine", null, visualizationColor);
  }

  const hilightBBDrop = () => {
    const rearWheelCenter = points["rearWheelCenter"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (rearWheelCenter && bottomBracketCenter) {
      contextState.addShapeVisualizationFunc("bbDropLine", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: bottomBracketCenter.x,
        y1: bottomBracketCenter.y,
        x2: bottomBracketCenter.x,
        y2: rearWheelCenter.y
      }, visualizationColor);
    }
  }

  const hideBBDrop = () => {
    contextState.addShapeVisualizationFunc("bbDropLine", null, visualizationColor);
  }

  const hilightHeadAngle = () => {
    const frontWheelCenter = points["frontWheelCenter"];
    const bottomBracketCenter = points["bottomBracketCenter"];
    const headTubeTop = points["headTubeTop"];

    if (frontWheelCenter && bottomBracketCenter && headTubeTop) {
      contextState.addShapeVisualizationFunc("headAngle", {
        type: 'angle',
        strokeWidth: strokeWidth,
        x1: bottomBracketCenter.x,
        y1: frontWheelCenter.y,
        x2: headTubeTop.x + (frontWheelCenter.y - headTubeTop.y) / Math.tan(headAngle * Math.PI / 180.0),
        y2: frontWheelCenter.y,
        x3: headTubeTop.x,
        y3: headTubeTop.y,
      }, visualizationColor);
    }
  }

  const hideHeadAngle = () => {
    contextState.addShapeVisualizationFunc("headAngle", null, visualizationColor);
  }

  const hilightSeatAngle = () => {
    const rearWheelCenter = points["rearWheelCenter"];
    const bottomBracketCenter = points["bottomBracketCenter"];
    const seatTubeTop = points["seatTubeTop"];

    if (rearWheelCenter && bottomBracketCenter && seatTubeTop) {
      contextState.addShapeVisualizationFunc("seatAngle", {
        type: 'angle',
        strokeWidth: strokeWidth,
        x1: rearWheelCenter.x,
        y1: bottomBracketCenter.y,
        x2: bottomBracketCenter.x,
        y2: bottomBracketCenter.y,
        x3: seatTubeTop.x,
        y3: seatTubeTop.y,
      }, visualizationColor);
    }
  }

  const hideSeatAngle = () => {
    contextState.addShapeVisualizationFunc("seatAngle", null, visualizationColor);
  }

  useEffect(() => {
    if (state.highlightedElement == 'stack') {
      hilightStack();
    } else {
      hideStack();
    }

    if (state.highlightedElement == 'reach') {
      hilightReach();
    } else {
      hideReach();
    }

    if (state.highlightedElement == 'topTubeEffective') {
      hilightTopTubeEffective();
    } else {
      hideTopTubeEffective();
    }

    if (state.highlightedElement == 'seatTube') {
      hilightSeatTube();
    } else {
      hideSeatTube();
    }

    if (state.highlightedElement == 'wheelbase') {
      hilightWheelbase();
    } else {
      hideWheelbase();
    }

    if (state.highlightedElement == 'chainstay') {
      hilightChainstay();
    } else {
      hideChainstay();
    }

    if (state.highlightedElement == 'headTube') {
      hilightHeadTube();
    } else {
      hideHeadTube();
    }

    if (state.highlightedElement == 'bbDrop') {
      hilightBBDrop();
    } else {
      hideBBDrop();
    }

    if (state.highlightedElement == 'headAngle') {
      hilightHeadAngle();
    } else {
      hideHeadAngle();
    }

    if (state.highlightedElement == 'seatAngle') {
      hilightSeatAngle();
    } else {
      hideSeatAngle();
    }
  }, [contextState.addShapeVisualizationFunc, state, points, wheelbase]);

  return (
    <div className="bike-geometry-table">
      <div>
      <h3>{children}</h3>
      <table>
        <thead>
          <tr>
            <th>Spec</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr onMouseEnter={() => {updateState({highlightedElement: "reach"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Reach</td>
            <td>{reach.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "stack"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Stack</td>
            <td>{stack.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "topTubeEffective"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Top Tube (eff)</td>
            <td>{topTube.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "seatTube"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Seat Tube C-T</td>
            <td>{seatTubeCT.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "headAngle"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Head Angle</td>
            <td>{headAngle.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "seatAngle"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Seat Angle</td>
            <td>{seatAngle.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "headTube"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Head Tube</td>
            <td>{headTube.toFixed(0)}</td>
          </tr>
          <tr  onMouseEnter={() => {updateState({highlightedElement: "chainstay"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Chainstay</td>
            <td>{chainstay.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "wheelbase"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>Wheelbase</td>
            <td>{finalWheelbase.toFixed(0)}</td>
          </tr>
          <tr onMouseEnter={() => {updateState({highlightedElement: "bbDrop"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>BB Drop</td>
            <td>{bbDrop.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default BikeGeometryTable;
