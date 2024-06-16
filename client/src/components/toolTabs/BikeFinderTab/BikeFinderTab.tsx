
import React from 'react';
import BikeFinder from '../../storage/BikeFinder';
import { useGeometryContext } from '../../../contexts/GeometryContext';
import BackgroundImage from '../../drawing/BackgroundImage';
import SizesList from './SizesList';

const BikeFinderTab = () => {

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  return (
    <div>
      <BikeFinder/>
      <SizesList/>
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} isGrayedOut={true} desiredPxPerMM={1} focusPoint={null}/>}
    </div>
  );
};

export default BikeFinderTab;
