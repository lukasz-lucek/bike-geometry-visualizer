import React, {useEffect, useState} from 'react';
import LineMarker from './LineMarker';

const BikeGeometryTableLineRow = ({ value, startPoint, endPoint, strokeWidth, children}) => {

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [shape, setShape] = useState(null);

  const visualizationColor = "red";

  useEffect(() => {
    if (startPoint && endPoint) {
      setShape({
        shape: {
          type: 'line',
          strokeWidth: strokeWidth,
          x1: startPoint.x,
          y1: startPoint.y,
          x2: endPoint.x,
          y2: endPoint.y
        },
        color: visualizationColor,
      })
    }
  }, [startPoint, endPoint]);

  return (
    <tr onMouseEnter={() => {setIsHighlighted(true)}} onMouseLeave={() => {setIsHighlighted(false)}}>
      <td>{children}</td>
      <td>{value.toFixed(0)}</td>
      {isHighlighted && shape && <LineMarker shape={shape}/>}
    </tr>
  );
};

export default BikeGeometryTableLineRow;
