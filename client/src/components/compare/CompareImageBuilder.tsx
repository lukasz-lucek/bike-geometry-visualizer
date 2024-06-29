
import React, { useEffect, useState } from 'react';
import { useComparisonContext } from '../../contexts/ComparisonContext';
import { useGeometryContext } from '../../contexts/GeometryContext';
import GeometryPointsFromMeasures from '../stitchers/GeometryPointsFromMeasures';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Canvas } from '../drawing/Canvas';
import BackgroundImage from '../drawing/BackgroundImage';
import {PuffLoader } from 'react-spinners';
import { findPxPerMm } from '../../utils/GeometryUtils';
import { Point2d } from '../../interfaces/Point2d';
import { DestinationGeometryPoints, defaultDestinationGeometryPoints } from '../stitchers/BikeImageStitcher';

const CompareImageBuilder = ({
  sizeName,
}: {
  sizeName: string;
}) => {

  const desiredPxPerMM = 1.0;

  const [bikeDrawn, setBikeDrawn] = useState<boolean>(false);
  const [destinationGeometry, setDestiantionGeometry] = useState<DestinationGeometryPoints>(defaultDestinationGeometryPoints);

  const {
    state: [toCompare, setToCompare],
  } = useComparisonContext();

  const {
    state: [geometryState, __],
    metadata: [bikeMetadata, ___],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const setImage = (image: string, leftMargin: number, topMargin: number) => {
    setToCompare([...toCompare.filter((bike, index) => {
      return (!(
        bike.make == bikeMetadata.make &&
        bike.model == bikeMetadata.model &&
        bike.year == bikeMetadata.year &&
        bike.user == bikeMetadata.user &&
        bike.sizeName == sizeName
      ));
    }), {
      sizeName: sizeName,
      make: bikeMetadata.make,
      model: bikeMetadata.model,
      image: image,
      rearWheelCenter: {x: destinationGeometry.rearWheelCenter!.x - leftMargin, y: destinationGeometry.rearWheelCenter!.y - topMargin},
      bottomBracketCenter: {x: destinationGeometry.bottomBracketCenter!.x - leftMargin, y: destinationGeometry.bottomBracketCenter!.y - topMargin},
      crankArmEnd: {x: destinationGeometry.crankArmEnd!.x - leftMargin, y: destinationGeometry.crankArmEnd!.y - topMargin},
      year : bikeMetadata.year,
      _id: bikeMetadata._id,
      user: bikeMetadata.user,
      isPublic: bikeMetadata.isPublic,
      data: null
    }]);
  }

  useEffect(() => {
    setBikeDrawn(false);
    if (
      !destinationGeometry.rearWheelCenter ||
      !destinationGeometry.bottomBracketCenter || 
      !destinationGeometry.frontWheelCenter
      // !destinationGeometry.orgPxPerMM || 
      // !destinationGeometry.desiredPxPerMM
    ) {
      return;
    }
    setTimeout(() => {
      
      if (canvasState.canvas) {
        if (
          !destinationGeometry.rearWheelCenter ||
          !destinationGeometry.bottomBracketCenter || 
          !destinationGeometry.frontWheelCenter 
          // !destinationGeometry.orgPxPerMM || 
          // !destinationGeometry.desiredPxPerMM
        ) {
          return;
        }
        //almost, but actually need to use size of bike after scaling....
        const rearWheelCenter = destinationGeometry.rearWheelCenter;
        const frontWheelCenter = destinationGeometry.frontWheelCenter;
        // const rate = destinationGeometry.desiredPxPerMM / destinationGeometry.orgPxPerMM;
        let estimatedWidth = frontWheelCenter.x + geometryState.fixedCircles.frontWheel.radius * desiredPxPerMM;
        let estimatedHeight = frontWheelCenter.y + geometryState.fixedCircles.frontWheel.radius * desiredPxPerMM;

        let estimatedMarginLeft = rearWheelCenter.x - geometryState.fixedCircles.rearWheel.radius * desiredPxPerMM;
        //let estimatedMarginLeft = 0;
        let estimatedMarginTop = 0;

        // estimatedWidth = estimatedWidth / pxPerMm!;
        // estimatedHeight = estimatedHeight / pxPerMm!;
        const image = canvasState.canvas.toSVG(
          {
            width: estimatedWidth - estimatedMarginLeft,
            height: estimatedHeight - estimatedMarginTop,
            viewBox: {
              x: estimatedMarginLeft,
              y: estimatedMarginTop,
              width: estimatedWidth - estimatedMarginLeft,
              height: estimatedHeight - estimatedMarginTop
            }
          }
        );
        console.log(image);
        setImage(image, estimatedMarginLeft, estimatedMarginTop);
        //setTimeout(() => {
          setBikeDrawn(true);
        //}, 1000);
      }
      
    }, 2500)
  }, [geometryState, bikeMetadata, sizeName, canvasState, destinationGeometry]);

  return (
    <div>
      <BackgroundImage desiredPxPerMM={desiredPxPerMM} opacity={0} focusPoint={null}/>
      <GeometryPointsFromMeasures 
        sizeMeasures={geometryState.sizesTable.get(sizeName)!}
        desiredPxPerMM={desiredPxPerMM}
        handlebarMeasurements={geometryState.handlebarsTable.get(sizeName)!}
        setDestinationGeometryPoints={setDestiantionGeometry}/>
        {!bikeDrawn && <PuffLoader style={{position: "absolute"}}/>}
      <div style={{width: 75, height: 75}}>
        <Canvas />
      </div>
    </div>
  );
};

export default CompareImageBuilder;
