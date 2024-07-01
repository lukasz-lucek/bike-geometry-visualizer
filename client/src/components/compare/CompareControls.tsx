
import React from 'react';
import { useComparisonContext } from '../../contexts/ComparisonContext';
import '../../App.css';
import AlignmentPointSelect from './AlignmentPointSelect';
import OpacitySlider from './OpacitySlider';
import ComparisoonDrawer from './ComparisoonDrawer';

const CompareControls = () => {

  const {
    bikes: [toCompare, _],
  } = useComparisonContext();

  return (
    <div >
      {toCompare.length == 0 && <p>No bike selected for comparison - go to Find and load</p>}
      {toCompare.length > 0 && 
      <div>
        <AlignmentPointSelect/>
        <OpacitySlider/>
        <ComparisoonDrawer/>
      </div>
      }
    </div>
  );
};

export default CompareControls;
