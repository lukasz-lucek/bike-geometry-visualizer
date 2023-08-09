// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';
import './BikeGeometryTable.css'; // Import the CSS file

const BikeGeometryTable = ({ points, wheelbase }) => {

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

  const rearWheelCenter = points["rearWheelCenter"];
  const frontWheelCenter = points["frontWheelCenter"];

  if (rearWheelCenter && frontWheelCenter) {
    const wheelbasePx = Math.sqrt(Math.pow(rearWheelCenter.x - frontWheelCenter.x, 2) + Math.pow(rearWheelCenter.y - frontWheelCenter.y, 2));
    const pxPerMm = wheelbasePx / wheelbase;

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
            console.log("radians: ", seatAngleRadTo90);
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
        x1: rearWheelCenter.x,
        y1: rearWheelCenter.y,
        x2: frontWheelCenter.x,
        y2: rearWheelCenter.y
      }, visualizationColor);

      contextState.addShapeVisualizationFunc("frontWheelLine", {
        type: 'line',
        x1: frontWheelCenter.x,
        y1: frontWheelCenter.y,
        x2: rearWheelCenter.x,
        y2: frontWheelCenter.y
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

  useEffect(() => {
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
  }, [contextState.addShapeVisualizationFunc, state, points, wheelbase]);

  return (
    <div className="bike-geometry-table">
      <h3>Bike Geometry Specifications</h3>
      <table>
        <thead>
          <tr>
            <th>Spec</th>
            <th>Value(mm)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Reach</td>
            <td>{reach.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Stack</td>
            <td>{stack.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Top Tube (effective)</td>
            <td>{topTube.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Seat Tube C-T</td>
            <td>{seatTubeCT.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Head Angle</td>
            <td>{headAngle.toFixed(0)}</td>
          </tr>
          <tr>
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
          <tr>
            <td>BB Drop</td>
            <td>{bbDrop.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BikeGeometryTable;
