
import React, { useEffect, useState } from 'react';
import { useComparisonContext } from '../../contexts/ComparisonContext';
import { useGeometryContext } from '../../contexts/GeometryContext';
import GeometryPointsFromMeasures from '../stitchers/GeometryPointsFromMeasures';
import CompareImageBuilder from './CompareImageBuilder';
import CanvasProvider from '../../contexts/CanvasContext';

const CompareToggleButton = ({
  sizeName,
}: {
  sizeName: string;
}) => {

  const {
    state: [toCompare, setToCompare],
  } = useComparisonContext();

  const {
    metadata: [bikeMetadata, ___],
  } = useGeometryContext();

  const [isInCompare, setIsInCompare] = useState<boolean>(false);

  useEffect(() => {
    let inComp = false;
    toCompare.forEach((bike) =>{
      if (bike.make == bikeMetadata.make &&
          bike.model == bikeMetadata.model &&
          bike.year == bikeMetadata.year &&
          bike.user == bikeMetadata.user &&
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
      image: '',
      rearWheelCenter: {x: 0, y:0},
      bottomBracketCenter: {x: 0, y:0},
      crankArmEnd: {x: 0, y:0},
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
        bike.make == bikeMetadata.make &&
        bike.model == bikeMetadata.model &&
        bike.year == bikeMetadata.year &&
        bike.user == bikeMetadata.user &&
        bike.sizeName == sizeName
      ));
    }));
  }

  return (
    <div>
      {!isInCompare && <button onClick={() => addToComparison()}>Add to Comparison</button> }
      {isInCompare && <button  onClick={() => removeFromComparison()}>Remove from Comparison</button> }

      {isInCompare &&
      <CanvasProvider>
        <CompareImageBuilder sizeName={sizeName}/>
      </CanvasProvider>}
    </div>
  );
};

export default CompareToggleButton;
