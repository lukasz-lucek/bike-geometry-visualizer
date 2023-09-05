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
  const defauldStTTOffset = 30;
  const defauldHtTTOffset = 30;
  const defauldHbBtOffset = 50;
  const defaultTTWidth = 40;
  const defaultBTWidth = 60;
  const defaultSTWidth = 30;
  const defaultHTWidth = 40;
  const defaultForkWidth = 40;

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

  const getBTEndPoint = () => {
    const headTubeTop = points["headTubeTop"];
    const headTubeBottom = points["headTubeBottom"];

    if (headTubeTop && headTubeBottom) {
      const ratio = Math.sqrt(
        Math.pow(headTubeTop.x - headTubeBottom.x, 2) + Math.pow(headTubeTop.y - headTubeBottom.y, 2)
        ) / points.hbBtOffset;
      return {
        x: headTubeBottom.x - Math.abs(headTubeTop.x - headTubeBottom.x) / ratio,
        y: headTubeBottom.y - Math.abs(headTubeTop.y - headTubeBottom.y) / ratio,
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
        width: points.btWidth,
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
        width: points.stWidth,
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
        width: points.htWidth,
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
        width: points.forkWidth,
      }, visualizationColor);
    }
  }

  const hideFork = () => {
    contextState.addShapeVisualizationFunc("forkGrab", null, visualizationColor);
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
    if (points.hbBtOffset == null) {
      updatePoints({hbBtOffset: defauldHbBtOffset});
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
          
        </tbody>
      </table>
    </div>
  );
};

export default PartsGrabberSpecs;
