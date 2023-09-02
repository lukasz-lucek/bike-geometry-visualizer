// src/components/BikeGeometryTable.js
import React, {useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';

const PartsGrabberSpecs = ({ points, pxPerMm, updatePoints }) => {

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

  const strokeWidth = 1*pxPerMm;
  const visualizationColor = "red";
  const defauldStTTOffset = 20;
  const defauldHtTTOffset = 20;
  const defaultTTWidth = 20;

  const getTTStartPoint = () => {
    const seatTubeTop = points["seatTubeTop"];
    const bottomBracketCenter = points["bottomBracketCenter"];

    if (seatTubeTop && bottomBracketCenter) {
      const ratio = Math.sqrt(
        Math.pow(seatTubeTop.x - bottomBracketCenter.x, 2) + Math.pow(seatTubeTop.y - bottomBracketCenter.y, 2)
        ) / points.stTtOffset;
      return {
        x: seatTubeTop.x + Math.abs(seatTubeTop.x - bottomBracketCenter.x) / ratio,
        y: seatTubeTop.y + Math.abs(seatTubeTop.y - bottomBracketCenter.y) / ratio,
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
        ) / points.htTtOffset;
      return {
        x: headTubeTop.x + Math.abs(headTubeTop.x - headTubeBottom.x) / ratio,
        y: headTubeTop.y + Math.abs(headTubeTop.y - headTubeBottom.y) / ratio,
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
        width: points.ttWidth,
      }, visualizationColor);
    }
  }

  const hideTopTube = () => {
    contextState.addShapeVisualizationFunc("topTubeGrab", null, visualizationColor);
  }

  useEffect(() => {
    if (points.htTtOffset == null) {
      updatePoints({htTtOffset: defauldHtTTOffset});
    }
    if (points.stTtOffset == null) {
      updatePoints({stTtOffset: defauldStTTOffset});
    }
    if (points.ttWidth == null) {
      updatePoints({ttWidth: defaultTTWidth});
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
  }, [contextState.addShapeVisualizationFunc, state, points, pxPerMm, updatePoints]);

  return (
    <div>
      <h3>Additional geometry specs</h3>
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
          
        </tbody>
      </table>
    </div>
  );
};

export default PartsGrabberSpecs;
