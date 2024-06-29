
import React from 'react';
import BikeFinder from '../../storage/BikeFinder';
import { useGeometryContext } from '../../../contexts/GeometryContext';
import BackgroundImage from '../../drawing/BackgroundImage';
import SizesList from './SizesList';

const BikeFinderTab = () => {

  const {
    state: [geometryState],
  } = useGeometryContext();

  return (
    <div>
      <BikeFinder/>
      <SizesList/>
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} opacity={0.4} desiredPxPerMM={1} focusPoint={null}/>}
    </div>
  );
};

export default BikeFinderTab;
