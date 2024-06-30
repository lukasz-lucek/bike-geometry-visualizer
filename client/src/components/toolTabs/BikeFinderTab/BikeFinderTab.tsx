
import React from 'react';
import BikeFinder from '../../storage/BikeFinder';
import { useGeometryContext } from '../../../contexts/GeometryContext';
import BackgroundImage from '../../drawing/BackgroundImage';
import SizesList from './SizesList';
import CompareBikesList from '../../compare/CompareBikesList';

const BikeFinderTab = () => {

  const {
    state: [geometryState],
  } = useGeometryContext();

  return (
    <div>
      <BikeFinder/>
      <SizesList/>
      <CompareBikesList/>
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'} opacity={1.0} desiredPxPerMM={1} focusPoint={null}/>}
    </div>
  );
};

export default BikeFinderTab;
