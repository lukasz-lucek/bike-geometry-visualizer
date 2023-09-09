// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';
import { findPxPerMm } from '../utils/GeometryUtils.js';
import TableValueEdit from './TableValueEdit.js';

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

  const getTTStartPoint = () => {
    const seatTubeTop = points["seatTubeTop"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (seatTubeTop && bottomBracketCenter) {
      const ratio = Math.sqrt(
        Math.pow(seatTubeTop.x - bottomBracketCenter.x, 2) + Math.pow(seatTubeTop.y - bottomBracketCenter.y, 2)
        ) / (points.stTtOffset  * pxPerMm);
      return {
        x: seatTubeTop.x - (seatTubeTop.x - bottomBracketCenter.x) / ratio,
        y: seatTubeTop.y - (seatTubeTop.y - bottomBracketCenter.y) / ratio,
      }
    }
    return null;
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
  

  const hilightStTtOffset = () => {
    const seatTubeTop = points["seatTubeTop"];
    const ttStart = getTTStartPoint();

    if (seatTubeTop && ttStart) {
        contextState.addShapeVisualizationFunc("StTtOffset", {
            type: 'line',
            strokeWidth: strokeWidth,
            x1: seatTubeTop.x,
            y1: seatTubeTop.y,
            x2: ttStart.x,
            y2: ttStart.y,
        }, visualizationColor);
    }
  }

  const hideStTtOffset = () => {
    contextState.addShapeVisualizationFunc("StTtOffset", null, visualizationColor);
  }

  const getTTEndPoint = () => {
    const headTubeTop = points["headTubeTop"];
    const headTubeBottom = points["headTubeBottom"];

    if (headTubeTop && headTubeBottom) {
      const ratio = Math.sqrt(
        Math.pow(headTubeTop.x - headTubeBottom.x, 2) + Math.pow(headTubeTop.y - headTubeBottom.y, 2)
        ) / (points.htTtOffset  * pxPerMm);
      return {
        x: headTubeTop.x - (headTubeTop.x - headTubeBottom.x) / ratio,
        y: headTubeTop.y - (headTubeTop.y - headTubeBottom.y) / ratio,
      }
    }
    return null;
  }

  const getBTEndPoint = () => {
    const headTubeTop = points["headTubeTop"];
    const headTubeBottom = points["headTubeBottom"];

    if (headTubeTop && headTubeBottom) {
      const ratio = Math.sqrt(
        Math.pow(headTubeTop.x - headTubeBottom.x, 2) + Math.pow(headTubeTop.y - headTubeBottom.y, 2)
        ) / (points.hbBtOffset * pxPerMm);
      return {
        x: headTubeBottom.x + (headTubeTop.x - headTubeBottom.x) / ratio,
        y: headTubeBottom.y + (headTubeTop.y - headTubeBottom.y) / ratio,
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

  const getSeatstayEndPoint = () => {
    const seatTubeTop = points["seatTubeTop"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (seatTubeTop && bottomBracketCenter) {
      const ratio = Math.sqrt(
        Math.pow(seatTubeTop.x - bottomBracketCenter.x, 2) + Math.pow(seatTubeTop.y - bottomBracketCenter.y, 2)
        ) / (points.bbSeatstayOffset  * pxPerMm);
      return {
        x: seatTubeTop.x - (seatTubeTop.x - bottomBracketCenter.x) / ratio,
        y: seatTubeTop.y - (seatTubeTop.y - bottomBracketCenter.y) / ratio,
      }
    }
    return null;
  }

  const hilightHtTtOffset = () => {
    const headTubeTop = points["headTubeTop"];
    const ttEnd = getTTEndPoint();
    
    if (headTubeTop && ttEnd) {
      contextState.addShapeVisualizationFunc("HtTtOffset", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: headTubeTop.x,
        y1: headTubeTop.y,
        x2: ttEnd.x,
        y2: ttEnd.y,
      }, visualizationColor);
    }
  }

  const hideHtTtOffset = () => {
    contextState.addShapeVisualizationFunc("HtTtOffset", null, visualizationColor);
  }

  const hilightTopTube = () => {
    const ttStart = getTTStartPoint();
    const ttEnd = getTTEndPoint();

    if (ttStart && ttEnd) {
      contextState.addShapeVisualizationFunc("topTubeGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: ttStart.x,
        y1: ttStart.y,
        x2: ttEnd.x,
        y2: ttEnd.y,
        width: points.ttWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideTopTube = () => {
    contextState.addShapeVisualizationFunc("topTubeGrab", null, visualizationColor);
  }

  const hilightHbBtOffset = () => {
    const headTubeBottom = points["headTubeBottom"];
    const btEnd = getBTEndPoint();
    
    if (headTubeBottom && btEnd) {
      contextState.addShapeVisualizationFunc("HbBtOffset", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: headTubeBottom.x,
        y1: headTubeBottom.y,
        x2: btEnd.x,
        y2: btEnd.y,
      }, visualizationColor);
    }
  }

  const hideHbBtOffset = () => {
    contextState.addShapeVisualizationFunc("HbBtOffset", null, visualizationColor);
  }

  const hilightBottomTube = () => {
    const btStart = points["bottomBracketCenter"];
    const btEnd = getBTEndPoint();

    if (btStart && btEnd) {
      contextState.addShapeVisualizationFunc("bottomTubeGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: btStart.x,
        y1: btStart.y,
        x2: btEnd.x,
        y2: btEnd.y,
        width: points.btWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideBottomTube = () => {
    contextState.addShapeVisualizationFunc("bottomTubeGrab", null, visualizationColor);
  }

  const hilightSeatTube = () => {
    const stStart = points["bottomBracketCenter"];
    const stEnd = points["seatTubeTop"];

    if (stStart && stEnd) {
      contextState.addShapeVisualizationFunc("seatTubeGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: stStart.x,
        y1: stStart.y,
        x2: stEnd.x,
        y2: stEnd.y,
        width: points.stWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideSeatTube = () => {
    contextState.addShapeVisualizationFunc("seatTubeGrab", null, visualizationColor);
  }

  const hilightHeadTube = () => {
    const htStart = points["headTubeTop"];
    const htEnd = points["headTubeBottom"];

    if (htStart && htEnd) {
      contextState.addShapeVisualizationFunc("headTubeGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: htStart.x,
        y1: htStart.y,
        x2: htEnd.x,
        y2: htEnd.y,
        width: points.htWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideHeadTube = () => {
    contextState.addShapeVisualizationFunc("headTubeGrab", null, visualizationColor);
  }

  const hilightFork = () => {
    const forkStart = points["headTubeBottom"];
    const forkEnd = points["frontWheelCenter"];

    if (forkStart && forkEnd) {
      contextState.addShapeVisualizationFunc("forkGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: forkStart.x,
        y1: forkStart.y,
        x2: forkEnd.x,
        y2: forkEnd.y,
        width: points.forkWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideFork = () => {
    contextState.addShapeVisualizationFunc("forkGrab", null, visualizationColor);
  }

  const hilightChainstay = () => {
    const chainstayStart = points["rearWheelCenter"];
    const chainstayEnd = points["bottomBracketCenter"];

    console.log("hilighting chainstay");

    if (chainstayStart && chainstayEnd) {
      console.log("hilighting chainstay even more");
      contextState.addShapeVisualizationFunc("cahinstayGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: chainstayStart.x,
        y1: chainstayStart.y,
        x2: chainstayEnd.x,
        y2: chainstayEnd.y,
        width: points.chainstayWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideChainstay = () => {
    contextState.addShapeVisualizationFunc("cahinstayGrab", null, visualizationColor);
  }

  const hilightBbSeatstayOffset = () => {
    const stEnd = points["seatTubeTop"];
    const seatstayEnd = getSeatstayEndPoint();
    
    if (stEnd && seatstayEnd) {
      contextState.addShapeVisualizationFunc("bbSeatstayOffset", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: stEnd.x,
        y1: stEnd.y,
        x2: seatstayEnd.x,
        y2: seatstayEnd.y,
      }, visualizationColor);
    }
  }

  const hideBbSeatstayOffset = () => {
    contextState.addShapeVisualizationFunc("bbSeatstayOffset", null, visualizationColor);
  }

  const hilightSeatstay = () => {
    const seatstayStart = points["rearWheelCenter"];
    const seatstayEnd = getSeatstayEndPoint();

    if (seatstayStart && seatstayEnd) {
      contextState.addShapeVisualizationFunc("seatstayGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: seatstayStart.x,
        y1: seatstayStart.y,
        x2: seatstayEnd.x,
        y2: seatstayEnd.y,
        width: points.seatstayWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideSeatstay = () => {
    contextState.addShapeVisualizationFunc("seatstayGrab", null, visualizationColor);
  }

  const hilightWheels = () => {
    const rearWheelCenter = points["rearWheelCenter"];
    const frontWheelCenter = points["frontWheelCenter"];

    if (rearWheelCenter) {
      contextState.addShapeVisualizationFunc("rearWheelGrab", {
        type: 'circle',
        strokeWidth: strokeWidth,
        x: rearWheelCenter.x,
        y: rearWheelCenter.y,
        radius: points.wheelsRadius * pxPerMm,
        startAngle: 0,
        endAngle: 360
      }, visualizationColor);
    }

    if (frontWheelCenter) {
      contextState.addShapeVisualizationFunc("frontWheelGrab", {
        type: 'circle',
        strokeWidth: strokeWidth,
        x: frontWheelCenter.x,
        y: frontWheelCenter.y,
        radius: points.wheelsRadius * pxPerMm,
        startAngle: 0,
        endAngle: 360
      }, visualizationColor);
    }
  }

  const hideWheels = () => {
    contextState.addShapeVisualizationFunc("rearWheelGrab", null, visualizationColor);
    contextState.addShapeVisualizationFunc("frontWheelGrab", null, visualizationColor);
  }

  const hilightChainring = () => {
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (bottomBracketCenter) {
      contextState.addShapeVisualizationFunc("chainringGrab", {
        type: 'circle',
        strokeWidth: strokeWidth,
        x: bottomBracketCenter.x,
        y: bottomBracketCenter.y,
        radius: points.chainringRadius * pxPerMm,
        startAngle: 0,
        endAngle: 360
      }, visualizationColor);
    }
  }

  const hideChainring = () => {
    contextState.addShapeVisualizationFunc("chainringGrab", null, visualizationColor);
  }

  const hilightCrankArm = () => {
    const crankArmStart = points["bottomBracketCenter"];
    const crankArmEnd = points["crankArmEnd"];;

    if (crankArmStart && crankArmEnd) {
      contextState.addShapeVisualizationFunc("crankArmGrab", {
        type: 'rectangle',
        strokeWidth: strokeWidth,
        x1: crankArmStart.x,
        y1: crankArmStart.y,
        x2: crankArmEnd.x,
        y2: crankArmEnd.y,
        width: points.crankArmWidth * pxPerMm,
      }, visualizationColor);
    }
  }

  const hideCrankArm = () => {
    contextState.addShapeVisualizationFunc("crankArmGrab", null, visualizationColor);
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

    const defaultStTTOffset = 30;
    const defaultHtTTOffset = 30;
    const defaultHbBtOffset = 50;
    const defaultTTWidth = 40;
    const defaultBTWidth = 60;
    const defaultSTWidth = 30;
    const defaultHTWidth = 40;
    const defaultForkWidth = 40;
    const defaultChainstayWidth = 30;
    const defaultBbSeatstayOffset = 30;
    const defaultSeatstayWidth = 30;
    const defaultWheelsRadius = 360;
    const defaultChainringRadius = 100;
    const defaultCrankArmWidth = 30;
    const defaultSeatPostLength = 350;
    const defaultSeatPostWidth = 300;
    const defaultStemOffset = 50;
    const defaultStemWidth = 45;
    const defaultSpacersWidth = 45;
    const defaultHandlebarsRadius = 200;

    if (points.htTtOffset == null) {
      updatePoints({htTtOffset: defaultHtTTOffset});
    }
    if (points.stTtOffset == null) {
      updatePoints({stTtOffset: defaultStTTOffset});
    }
    if (points.ttWidth == null) {
      updatePoints({ttWidth: defaultTTWidth});
    }
    if (points.hbBtOffset == null) {
      updatePoints({hbBtOffset: defaultHbBtOffset});
    }
    if (points.btWidth == null) {
      updatePoints({btWidth: defaultBTWidth});
    }
    if (points.stWidth == null) {
      updatePoints({stWidth: defaultSTWidth});
    }
    if (points.htWidth == null) {
      updatePoints({htWidth: defaultHTWidth});
    }
    if (points.forkWidth == null) {
      updatePoints({forkWidth: defaultForkWidth});
    }
    if (points.chainstayWidth == null) {
      updatePoints({chainstayWidth: defaultChainstayWidth});
    }
    if (points.bbSeatstayOffset == null) {
      updatePoints({bbSeatstayOffset: defaultBbSeatstayOffset});
    }
    if (points.seatstayWidth == null) {
      updatePoints({seatstayWidth: defaultSeatstayWidth});
    }
    if (points.wheelsRadius == null) {
      updatePoints({wheelsRadius: defaultWheelsRadius});
    }
    if (points.chainringRadius == null) {
      updatePoints({chainringRadius: defaultChainringRadius});
    }
    if (points.crankArmWidth == null) {
      updatePoints({crankArmWidth: defaultCrankArmWidth});
    }
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


    if (state.highlightedElement == 'stTtOffset') {
      hilightStTtOffset();
    } else {
      hideStTtOffset();
    }

    if (state.highlightedElement == 'htTtOffset') {
      hilightHtTtOffset();
    } else {
      hideHtTtOffset();
    }

    if (state.highlightedElement == 'topTubeGrab' || 
        state.highlightedElement == 'htTtOffset' || 
        state.highlightedElement == 'stTtOffset') {
      hilightTopTube();
    } else {
      hideTopTube();
    }

    if (state.highlightedElement == 'hbBtOffset') {
      hilightHbBtOffset();
    } else {
      hideHbBtOffset();
    }

    if (state.highlightedElement == 'bottomTubeGrab' || 
        state.highlightedElement == 'hbBtOffset') {
      hilightBottomTube();
    } else {
      hideBottomTube();
    }

    if (state.highlightedElement == 'seatTubeGrab') {
      hilightSeatTube();
    } else {
      hideSeatTube();
    }

    if (state.highlightedElement == 'headTubeGrab') {
      hilightHeadTube();
    } else {
      hideHeadTube();
    }

    if (state.highlightedElement == 'forkGrab') {
      hilightFork();
    } else {
      hideFork();
    }

    if (state.highlightedElement == 'cahinstayGrab') {
      hilightChainstay();
    } else {
      hideChainstay();
    }

    if (state.highlightedElement == 'bbSeatstayOffset') {
      hilightBbSeatstayOffset();
    } else {
      hideBbSeatstayOffset();
    }

    if (state.highlightedElement == 'seatstayGrab' || 
        state.highlightedElement == 'bbSeatstayOffset') {
      hilightSeatstay();
    } else {
      hideSeatstay();
    }

    if (state.highlightedElement == 'wheelsGrab') {
      hilightWheels();
    } else {
      hideWheels();
    }

    if (state.highlightedElement == 'chainringGrab') {
      hilightChainring();
    } else {
      hideChainring();
    }

    if (state.highlightedElement == 'crankArmGrab') {
      hilightCrankArm();
    } else {
      hideCrankArm();
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
      <h3>Additional geometry specs</h3>
      <div className="bike-geometry-table">
        <table enabled={pxPerMm != 0}>
          <thead>
            <tr>
              <th>Spec</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr onMouseEnter={() => {updateState({highlightedElement: "stTtOffset"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>ST-TT-Off</td>
              <td>{ points.stTtOffset?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({stTtOffset : points.stTtOffset + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({stTtOffset : points.stTtOffset - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "htTtOffset"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>HT-TT-Off</td>
              <td>{ points.htTtOffset?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({htTtOffset: points.htTtOffset + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({htTtOffset: points.htTtOffset - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "topTubeGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>TT-Radius</td>
              <td>{ points.ttWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({ttWidth: points.ttWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({ttWidth: points.ttWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "hbBtOffset"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>HB-BT-Off</td>
              <td>{ points.hbBtOffset?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({hbBtOffset: points.hbBtOffset + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({hbBtOffset: points.hbBtOffset - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "bottomTubeGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>BT-Radius</td>
              <td>{ points.btWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({btWidth: points.btWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({btWidth: points.btWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "seatTubeGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>ST-Radius</td>
              <td>{ points.stWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({stWidth: points.stWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({stWidth: points.stWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "headTubeGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>HT-Radius</td>
              <td>{ points.htWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({htWidth: points.htWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({htWidth: points.htWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "forkGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>fork-Radius</td>
              <td>{ points.forkWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({forkWidth: points.forkWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({forkWidth: points.forkWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "cahinstayGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>chainstay-Radius</td>
              <td>{ points.chainstayWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({chainstayWidth: points.chainstayWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({chainstayWidth: points.chainstayWidth - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "bbSeatstayOffset"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>HB-BT-Off</td>
              <td>{ points.bbSeatstayOffset?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({bbSeatstayOffset: points.bbSeatstayOffset + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({bbSeatstayOffset: points.bbSeatstayOffset - 5})}}>-</button></td>
            </tr>

            <tr onMouseEnter={() => {updateState({highlightedElement: "seatstayGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>Seatstay-Radius</td>
              <td>{ points.seatstayWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({seatstayWidth: points.seatstayWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({seatstayWidth: points.seatstayWidth - 5})}}>-</button></td>
            </tr>
          </tbody>
        </table>
        <table enabled={pxPerMm != 0}>
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
            
            <tr onMouseEnter={() => {updateState({highlightedElement: "crankArmGrab"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
              <td>Crank-Width</td>
              <td>{ points.crankArmWidth?.toFixed(0)}</td>
              <td><button onClick={() => {updatePoints({crankArmWidth: points.crankArmWidth + 5})}}>+</button></td>
              <td><button onClick={() => {updatePoints({crankArmWidth: points.crankArmWidth - 5})}}>-</button></td>
            </tr>
            {/* <TableValueEdit points={points} updatePoints={updatePoints} observedProperty="seatpostLength"
              highlightName="seatpostGrab" updateParentState={updateState}>
              Seatpost-length
            </TableValueEdit> */}

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
        </table>
      </div>
    </div>
  );
};

export default PartsGrabberSpecs;
