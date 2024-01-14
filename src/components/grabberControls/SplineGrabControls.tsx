import React, { useState } from 'react';
import PointGrabButton from './PointGrabButton';

const SplineGrabControls = () => {

  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  return (
    <div >
      <PointGrabButton className='rear-wheel-center' pointKey='rearWheelCenter' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Rear Wheel Center
      </PointGrabButton>
    </div>
  );
};

export default SplineGrabControls;