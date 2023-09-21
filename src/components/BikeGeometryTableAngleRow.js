import React, {useEffect, useState} from 'react';
import AngleMarker from './AngleMarker';

const BikeGeometryTableAngleRow = ({ value, startPoint, middlePoint, endPoint, strokeWidth, children}) => {

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [shape, setShape] = useState(null);

  const visualizationColor = "red";

  useEffect(() => {
    if (startPoint && middlePoint && endPoint) {
      setShape({
        shape: {
          type: 'angle',
          strokeWidth: strokeWidth,
          x1: startPoint.x,
          y1: startPoint.y,
          x2: middlePoint.x,
          y2: middlePoint.y,
          x3: endPoint.x,
          y3: endPoint.y
        },
        color: visualizationColor,
      })
    }
  }, [startPoint, middlePoint, endPoint]);

  return (
    <tr onMouseEnter={() => {setIsHighlighted(true)}} onMouseLeave={() => {setIsHighlighted(false)}}>
      <td>{children}</td>
      <td>{value ? value.toFixed(0) : 0}</td>
      {isHighlighted && shape && <AngleMarker shape={shape}/>}
    </tr>
  );
};

export default BikeGeometryTableAngleRow;
