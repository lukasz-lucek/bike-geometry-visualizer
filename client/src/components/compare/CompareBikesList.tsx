
import React from 'react';
import { useComparisonContext } from '../../contexts/ComparisonContext';
import CompareThumbnail from './CompareThumbnail';
import '../../App.css';

const CompareBikesList = () => {

  const {
    bikes: [toCompare, _],
  } = useComparisonContext();

  return (
    <div className='compare-bikes-list'>
      {toCompare.map((bike) => (
        <CompareThumbnail bike={bike}/>
      ))}
      
    </div>
  );
};

export default CompareBikesList;
