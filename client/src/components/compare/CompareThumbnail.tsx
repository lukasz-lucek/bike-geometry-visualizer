
import React, { useEffect, useState } from 'react';
import { IBikeDataComparison, useComparisonContext } from '../../contexts/ComparisonContext';
import CompareImageBuilder from './CompareImageBuilder';
import CanvasProvider from '../../contexts/CanvasContext';
import '../../App.css';

const CompareThumbnail = ({bike} : {bike: IBikeDataComparison}) => {
  const {
    images: [images, _],
  } = useComparisonContext();

  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    console.log(`setting has Image for ${bike._id + bike.sizeName} to ${images.has(bike._id + bike.sizeName)}`);
    setHasImage(images.has(bike._id + bike.sizeName));
  }, [images, bike]);
  
  return (
    <div>
        {
          (bike._id && !hasImage) &&
          <CanvasProvider>
            <CompareImageBuilder sizeName={bike.sizeName} bike_id={bike._id}/>
          </CanvasProvider>
        }
        {
          (bike._id && hasImage) &&
          <div className='thumbnail-container'>
            <img src={images.get(bike._id + bike.sizeName)?.image}/>
          </div>
        }
    </div>
  );
};

export default CompareThumbnail;
