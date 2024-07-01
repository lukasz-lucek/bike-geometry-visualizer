
import React from 'react';
import { useComparisonContext } from '../../contexts/ComparisonContext';
import CompareThumbnail from './CompareThumbnail';
import '../../App.css';
import ComparisonBikeDrawer from './ComparisonBikeDrawer';

const ComparisoonDrawer = () => {

  const {
    bikes: [toCompare, _],
  } = useComparisonContext();

  return (
    <div>
      {toCompare.map((bike) => (
        <ComparisonBikeDrawer bike={bike}/>
      ))}
      
    </div>
  );
};

export default ComparisoonDrawer;
