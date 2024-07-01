import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { findAngle, findBBWithMargins, findBBFromImage, findDistance } from '../../utils/GeometryUtils'
import { useGeometryContext } from '../../contexts/GeometryContext';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Point2d } from '../../interfaces/Point2d';
import { AlignmentPoint, IBikeDataComparison, useComparisonContext } from '../../contexts/ComparisonContext';

interface ComparisonBikeDrawerProps {
  bike: IBikeDataComparison
}

export function ComparisonBikeDrawer(
  {
    bike,
  }: ComparisonBikeDrawerProps) {

    const {
      comparisonSettings: [comparisonSettings,],
      images: [images,]
    } = useComparisonContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const [loadedImage, setLoadedImage] = useState<fabric.Image | null>(null);

  useEffect(() => {
    const bikeId = bike._id + bike.sizeName
    const image = images.get(bikeId);
    const alignmentMethod = comparisonSettings.alignmentPoint;
    let opacity = comparisonSettings.opacities.get(bikeId);

    if (!image || image.image == '') {
      return;
    }
    if (opacity == undefined) {
      opacity = 1;
    }

    let topOffset = 800;
    let leftOffset = 360;
    let alignmentPoint = image.rearWheelCenter;

    switch (alignmentMethod) {
      case AlignmentPoint.REAR_WHHEL:
        topOffset = 800;
        leftOffset = 360;
        alignmentPoint = image.rearWheelCenter;
        break;
      case AlignmentPoint.BOTTOM_BRACKKET:
        topOffset = 880;
        leftOffset = 800;
        alignmentPoint = image.bottomBracketCenter;
        break;
      case AlignmentPoint.PEDAL_AXLE:
        topOffset = 1050;
        leftOffset = 830;
        alignmentPoint = image.crankArmEnd;
        break;
    }

    fabric.Image.fromURL(image.image, (img) => {
      setLoadedImage(img);
    },
    {
      top: topOffset - alignmentPoint.y,
      left: leftOffset - alignmentPoint.x,
      opacity: opacity,
    });

  }, [canvasState.canvas, comparisonSettings, images, bike]);

  useEffect(() => {
    if (loadedImage) {
      canvasState.canvas?.addObjectToLayer(loadedImage, 1);
      canvasState.canvas?.renderAll();
      return () => {
        //TODO - problematic if canvas is destroyed before this component
        canvasState.canvas?.removeObjectFromAnyLayer(loadedImage);
        //canvasState.canvas?.renderAll();
      }
    }
  }, [loadedImage]);

  return (
    <>
    </>
  );
}

export default ComparisonBikeDrawer;