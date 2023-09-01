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

  const strokeWidth = 5*pxPerMm;
  const visualizationColor = "red";
  const defauldStTTOffset = 20;
  const defauldHtTTOffset = 20;

  const hilightStTtOffset = () => {
    const seatTubeTop = points["seatTubeTop"];
    const bottomBracketCenter = points["bottomBracketCenter"];
    

    if (seatTubeTop && bottomBracketCenter) {
        const ratio = Math.sqrt(
            Math.pow(seatTubeTop.x - bottomBracketCenter.x, 2) + Math.pow(seatTubeTop.y - bottomBracketCenter.y, 2)
            ) / (points.stTtOffset ? points.stTtOffset : defauldStTTOffset);
        console.log("ratio: ", ratio);
        contextState.addShapeVisualizationFunc("StTtOffset", {
            type: 'line',
            strokeWidth: strokeWidth,
            x1: seatTubeTop.x,
            y1: seatTubeTop.y,
            x2: seatTubeTop.x + Math.abs(seatTubeTop.x - bottomBracketCenter.x) / ratio,
            y2: seatTubeTop.y + Math.abs(seatTubeTop.y - bottomBracketCenter.y) / ratio,
        }, visualizationColor);
    }
  }

  const hideStTtOffset = () => {
    contextState.addShapeVisualizationFunc("StTtOffset", null, visualizationColor);
  }

  const hilightHtTtOffset = () => {
    const headTubeTop = points["headTubeTop"];
    const headTubeBottom = points["headTubeBottom"];
    

    if (headTubeTop && headTubeBottom) {
        const ratio = Math.sqrt(
            Math.pow(headTubeTop.x - headTubeBottom.x, 2) + Math.pow(headTubeTop.y - headTubeBottom.y, 2)
            ) / (points.htTtOffset ? points.htTtOffset : defauldHtTTOffset);
      contextState.addShapeVisualizationFunc("HtTtOffset", {
        type: 'line',
        strokeWidth: strokeWidth,
        x1: headTubeTop.x,
        y1: headTubeTop.y,
        x2: headTubeTop.x + Math.abs(headTubeTop.x - headTubeBottom.x) / ratio,
        y2: headTubeTop.y + Math.abs(headTubeTop.y - headTubeBottom.y) / ratio,
      }, visualizationColor);
    }
  }

  const hideHtTtOffset = () => {
    contextState.addShapeVisualizationFunc("HtTtOffset", null, visualizationColor);
  }

  useEffect(() => {
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
  }, [contextState.addShapeVisualizationFunc, state, points, pxPerMm, updatePoints]);

  return (
    <div>
      <h3>Additional geometry specs</h3>
      <table enabled={pxPerMm != 0}>
        <thead>
          <tr>
            <th>Spec</th>
            <th>Value(mm)</th>
          </tr>
        </thead>
        <tbody>
          <tr onMouseEnter={() => {updateState({highlightedElement: "stTtOffset"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>ST-TT offset</td>
            <td>{ points.stTtOffset ? points.stTtOffset.toFixed(0) : defauldStTTOffset}</td>
            <td><button onClick={() => {updatePoints({stTtOffset: (points.stTtOffset ? points.stTtOffset : defauldStTTOffset ) + 5})}}>+</button></td>
            <td><button onClick={() => {updatePoints({stTtOffset: (points.stTtOffset ? points.stTtOffset : defauldStTTOffset ) - 5})}}>-</button></td>
          </tr>

          <tr onMouseEnter={() => {updateState({highlightedElement: "htTtOffset"})}} onMouseLeave={() => {updateState({highlightedElement: null})}}>
            <td>ST-TT offset</td>
            <td>{ points.htTtOffset ? points.htTtOffset.toFixed(0) : defauldHtTTOffset}</td>
            <td><button onClick={() => {updatePoints({htTtOffset: (points.htTtOffset ? points.htTtOffset : defauldHtTTOffset ) + 5})}}>+</button></td>
            <td><button onClick={() => {updatePoints({htTtOffset: (points.htTtOffset ? points.htTtOffset : defauldHtTTOffset ) - 5})}}>-</button></td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
};

export default PartsGrabberSpecs;
