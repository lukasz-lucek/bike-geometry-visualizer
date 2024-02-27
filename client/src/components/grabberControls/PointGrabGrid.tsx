import React, { useState } from 'react';
import PointGrabButton from './PointGrabButton';

const PointGrabGrid = () => {

  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  return (
    <div className="point-buttons">
      <PointGrabButton className='rear-wheel-center' pointKey='rearWheelCenter' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Rear Wheel Center
      </PointGrabButton>
      <PointGrabButton className='front-wheel-center' pointKey='frontWheelCenter' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Front Wheel Center
      </PointGrabButton>
      <PointGrabButton className='bottom-bracket-center' pointKey='bottomBracketCenter' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Bottom Bracket Center
      </PointGrabButton>
      <PointGrabButton className='head-tube-top' pointKey='headTubeTop' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Head Tube Top
      </PointGrabButton>
      <PointGrabButton className='head-tube-bottom' pointKey='headTubeBottom' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Head Tube Bottom
      </PointGrabButton>
      <PointGrabButton className='seat-tube-top' pointKey='seatTubeTop' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Seat Tube Top
      </PointGrabButton>
      <PointGrabButton className='crank-arm-end' pointKey='crankArmEnd' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Crank Arm End
      </PointGrabButton>
      <PointGrabButton className='handlebars-mount' pointKey='handlebarMount' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Handlebar mount point
      </PointGrabButton>
      <PointGrabButton className='seat-mount' pointKey='seatMount' selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint}>
        Seat mount point
      </PointGrabButton>
    </div>
  );
};

export default PointGrabGrid;