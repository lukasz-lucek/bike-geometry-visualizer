import React, { useEffect, useState } from 'react';
import { GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { Point2d } from '../../interfaces/Point2d';

interface PointMoveControlsProps {
  pointKey: keyof GeometryPoints;
}

const PointMoveControls = (props: PointMoveControlsProps) => {
  const [isShiftDown, setIsShiftDown] = useState(false);
  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const handleMovePoint = (delta: Point2d) => {
    const orgPoint = geometryState.geometryPoints[props.pointKey];
    if (!orgPoint)
    {
      return;
    }
    const stateChange = {
      geometryPoints: { 
        ...geometryState.geometryPoints,
        [props.pointKey]: { x: orgPoint.x + delta.x, y: orgPoint.y + delta.y, color: orgPoint.color } }
    };
    updateGeometryState(stateChange);

  };

  useEffect(() => {
    const evListener = (event: KeyboardEvent) => {
      setIsShiftDown(event.shiftKey)
    }
     // eslint-disable-next-line
    addEventListener("keydown", evListener);
    // eslint-disable-next-line
    addEventListener("keyup", evListener);
    return () => {
      // eslint-disable-next-line
      removeEventListener("keydown", evListener);
      // eslint-disable-next-line
      addEventListener("keyup", evListener);
    }
  },
  [props.pointKey])

  //TODO fix casting after geometry points are split
  return (
    <div>
      {!isShiftDown &&
      <div>
        <button onClick={() => handleMovePoint({x: -1, y: 0})}>
          &#8592;
        </button>
        <button onClick={() => handleMovePoint({x: 0, y: -1})}>
          &#8593;
        </button>
        <button onClick={() => handleMovePoint({x: 0, y: 1})}>
          &#8595;
        </button>
        <button onClick={() => handleMovePoint({x: 1, y: 0})}>
          &#8594;
        </button>
      </div>
      }

      {isShiftDown &&
      <div>
        <button onClick={() => handleMovePoint({x: -5, y: 0})}>
          &#8656;
        </button>
        <button onClick={() => handleMovePoint({x: 0, y: -5})}>
          &#8657;
        </button>
        <button onClick={() => handleMovePoint({x: 0, y: 5})}>
          &#8659;
        </button>
        <button onClick={() => handleMovePoint({x: 5, y: 0})}>
          &#8658;
        </button>
      </div>
      }
    </div>
  );
};

export default PointMoveControls;