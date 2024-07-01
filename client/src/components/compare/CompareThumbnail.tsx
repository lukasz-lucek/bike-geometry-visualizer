
import React, { useEffect, useState } from 'react';
import { IBikeDataComparison, useComparisonContext } from '../../contexts/ComparisonContext';
import CompareImageBuilder from './CompareImageBuilder';
import CanvasProvider from '../../contexts/CanvasContext';
import '../../App.css';

const CompareThumbnail = ({bike} : {bike: IBikeDataComparison}) => {

  const {
    bikes: [toCompare, setToCompare],
    images: [images, setImages],
  } = useComparisonContext();

  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    console.log(`setting has Image for ${bike._id + bike.sizeName} to ${images.has(bike._id + bike.sizeName)}`);
    setHasImage(images.has(bike._id + bike.sizeName));
  }, [images, bike]);

  const removeFromComparison = () => {
    setToCompare(toCompare.filter((bikeChecked, index) => {
      return (!(
        bikeChecked._id == bike._id &&
        bikeChecked.sizeName == bike.sizeName
      ));
    }));
    if (bike._id) {
      images.delete(bike._id + bike.sizeName);
      setImages(new Map(images));
    }
  }
  
  return (
    <div className='thumbnail'>
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
        <button onClick={(e) => {removeFromComparison()}}>X</button>
    </div>
  );
};

export default CompareThumbnail;
