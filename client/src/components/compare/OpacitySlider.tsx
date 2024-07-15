
import React, { useEffect, useState } from 'react';
import '../../App.css';
import { AlignmentPoint, useComparisonContext } from '../../contexts/ComparisonContext';

const OpacitySlider = () => {

  const {
    comparisonSettings: [comparisonSettings, setComparisonSettings],
    bikes: [toCompare, _],
  } = useComparisonContext();

  const [sliderVal, setSliderVal] = useState<number>(1);

  useEffect(() => {
    let newVals = new Map();
    toCompare.forEach((bike, index) => {
      if (!bike._id) {
        return;
      }
      const value = 1.0 - Math.min(Math.abs(sliderVal - 1 - index), 1);
      console.log("useEffect and value" + value);
      newVals.set(bike._id+bike.sizeName, value);
      
    });
    console.log(newVals);
    setComparisonSettings({...comparisonSettings, opacities: newVals});
  }, [sliderVal, toCompare])

  return (
    <div >
      <p>Slide to your haearts content</p>
      <input 
        type='range' 
        min={1} max={toCompare.length} step={0.01}
        value={sliderVal}
        onChange={(e) => {setSliderVal(Number(e.target.value))}}/>
    </div>
  );
};

export default OpacitySlider;
