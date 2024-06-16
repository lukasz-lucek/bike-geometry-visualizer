import React from 'react';
import PartsGrabberTable from '../grabberControls/PartsGrabberTable';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"

const PartsGrabber = () => {

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  return (
    <div>
      <PartsGrabberTable />
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={false} desiredPxPerMM={null} focusPoint={null}/>}
    </div>
  );
};

export default PartsGrabber
  ;
