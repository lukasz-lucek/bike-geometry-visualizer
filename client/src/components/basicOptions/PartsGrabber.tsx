import React from 'react';
import PartsGrabberTable from '../grabberControls/PartsGrabberTable';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"

const PartsGrabber = () => {

  const {
    state: [geometryState,],
  } = useGeometryContext();

  return (
    <div>
      <PartsGrabberTable />
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} opacity={1.0} desiredPxPerMM={null} focusPoint={null}/>}
    </div>
  );
};

export default PartsGrabber
  ;
