
import React, { useEffect, useState } from 'react';
import { useComparisonContext } from '../../contexts/ComparisonContext';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { IBikeData } from '../../IGeometryState';

const CompareToggleButton = ({
  sizeName,
}: {
  sizeName: string;
}) => {

  const {
    bikes: [toCompare, setToCompare],
    images: [images, setImages],
  } = useComparisonContext();

  const {
    metadata: [bikeMetadata, ___],
  } = useGeometryContext();

  const [isInCompare, setIsInCompare] = useState<boolean>(false);

  
  const isSameBike = (bikeOne: IBikeData, bikeTwo: IBikeData) : Boolean => {
    return bikeOne._id == bikeTwo._id;
  }

  useEffect(() => {
    let inComp = false;
    toCompare.forEach((bike) =>{
      if (isSameBike(bike, bikeMetadata) &&
          bike.sizeName == sizeName
      ) {
        inComp = true;
        return;
      } 
    });
    setIsInCompare(inComp);
  }, [toCompare, bikeMetadata, sizeName])

  const addToComparison = () => {
    setToCompare([...toCompare, {
      sizeName: sizeName,
      make: bikeMetadata.make,
      model: bikeMetadata.model,
      year : bikeMetadata.year,
      _id: bikeMetadata._id,
      user: bikeMetadata.user,
      isPublic: bikeMetadata.isPublic,
      data: null
    }]);
  }

  const removeFromComparison = () => {
    setToCompare(toCompare.filter((bike, index) => {
      return (!(
        isSameBike(bike, bikeMetadata) &&
        bike.sizeName == sizeName
      ));
    }));
    if (bikeMetadata._id) {
      images.delete(bikeMetadata._id + sizeName);
      setImages(new Map(images));
    }
  }

  return (
    <div>
      {!isInCompare && <button onClick={() => addToComparison()}>Add to Comparison</button> }
      {isInCompare && <button  onClick={() => removeFromComparison()}>Remove from Comparison</button> }
    </div>
  );
};

export default CompareToggleButton;
