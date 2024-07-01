
import React from 'react';
import '../../App.css';
import { AlignmentPoint, useComparisonContext } from '../../contexts/ComparisonContext';

const AlignmentPointSelect = () => {

  const {
    comparisonSettings: [comparisonSettings, setComparisonSettings],
  } = useComparisonContext();

  const setAlignmentMethod = (alignmentMethod: AlignmentPoint) : void => {
    setComparisonSettings({...comparisonSettings, alignmentPoint: alignmentMethod})
  }

  return (
    <div >
      <p>Alignment point:</p>
      <div>
        <input id='pedal-check' type='checkbox' onClick={(e) => {setAlignmentMethod(AlignmentPoint.PEDAL_AXLE)}} checked={comparisonSettings.alignmentPoint == AlignmentPoint.PEDAL_AXLE} />
        <label htmlFor='pedal-check'>Pedal</label>
        <input id='bb-check' type='checkbox' onClick={(e) => {setAlignmentMethod(AlignmentPoint.BOTTOM_BRACKKET)}} checked={comparisonSettings.alignmentPoint == AlignmentPoint.BOTTOM_BRACKKET} />
        <label htmlFor='bb-check'>Bottom Bracket</label>
        <input id='rear-wheel-check' type='checkbox' onClick={(e) => {setAlignmentMethod(AlignmentPoint.REAR_WHHEL)}} checked={comparisonSettings.alignmentPoint == AlignmentPoint.REAR_WHHEL} />
        <label htmlFor='rear-wheel-check'>Rear Wheel</label>
      </div>
    </div>
  );
};

export default AlignmentPointSelect;
