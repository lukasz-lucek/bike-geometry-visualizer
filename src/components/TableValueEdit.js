import React, { Children } from 'react';

export function TableValueEdit({points, updatePoints, observedProperty, highlightName, updateParentState}) {

  return (
    <tr onMouseEnter={() => {updateParentState({highlightedElement: highlightName})}} onMouseLeave={() => {updateParentState({highlightedElement: null})}}>
      <td>{Children}</td>
      <td>{ points[observedProperty]?.toFixed(0)}</td>
      <td><button onClick={() => {updatePoints({observedProperty:  points[observedProperty] + 5})}}>+</button></td>
      <td><button onClick={() => {updatePoints({observedProperty: points[observedProperty] - 5})}}>-</button></td>
    </tr>
  );
}

export default TableValueEdit;