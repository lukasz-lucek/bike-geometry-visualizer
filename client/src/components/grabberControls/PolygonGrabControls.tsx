import React, { useState } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Polygon } from '../../interfaces/Polygon';
import PolygonAppendControls from '../drawing/PolygonAppendControls';

const PolygonGrabControls = ({polygon, updatePolygon} : {polygon: Polygon, updatePolygon: (p: Polygon) => void}) => {

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const [addPointsActive, setAddPointsActive] = useState(false);

  return (
    <div >
      <label htmlFor='startGrabbingPolygon'>{polygon.vertices.length == 0 ? "Start grabbing" : "Append points"}</label>
      <input id='startGrabbingPolygon' type="checkbox" onChange={(e) => {setAddPointsActive(e.target.checked)}} checked={addPointsActive}/>
      {canvasState.canvas && addPointsActive && <PolygonAppendControls polygon={polygon} updatePolygon={updatePolygon}/>}
    </div>
  );
};

export default PolygonGrabControls;