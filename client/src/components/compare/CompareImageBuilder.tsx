
import React, { useEffect, useState } from 'react';
import { IBikeDataComparisonImages, useComparisonContext } from '../../contexts/ComparisonContext';
import { useGeometryContext } from '../../contexts/GeometryContext';
import GeometryPointsFromMeasures from '../stitchers/GeometryPointsFromMeasures';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { Canvas } from '../drawing/Canvas';
import {PuffLoader } from 'react-spinners';
import { DestinationGeometryPoints, defaultDestinationGeometryPoints } from '../stitchers/BikeImageStitcher';
import '../../App.css';

const CompareImageBuilder = ({
  sizeName,
  bike_id,
}: {
  sizeName: string;
  bike_id: string;
}) => {

  const desiredPxPerMM = 1.0;

  const [bikeDrawn, setBikeDrawn] = useState<boolean>(false);
  const [destinationGeometry, setDestiantionGeometry] = useState<DestinationGeometryPoints>(defaultDestinationGeometryPoints);

  const {
    images: [images, setImages],
  } = useComparisonContext();

  const {
    state: [geometryState, __],
    metadata: [bikeMetadata, ___],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const setImage = (image: string, leftMargin: number, topMargin: number) => {

    const newData: IBikeDataComparisonImages = {
      image: image,
      rearWheelCenter: {x: destinationGeometry.rearWheelCenter!.x - leftMargin, y: destinationGeometry.rearWheelCenter!.y - topMargin},
      bottomBracketCenter: {x: destinationGeometry.bottomBracketCenter!.x - leftMargin, y: destinationGeometry.bottomBracketCenter!.y - topMargin},
      crankArmEnd: {x: destinationGeometry.crankArmEnd!.x - leftMargin, y: destinationGeometry.crankArmEnd!.y - topMargin}
    }
    images.set(bike_id + sizeName, newData);
    setImages(new Map(images));

    // setImages([...images.filter((bike_id, image) => {
    //   return (!(
    //     bike.make == bikeMetadata.make &&
    //     bike.model == bikeMetadata.model &&
    //     bike.year == bikeMetadata.year &&
    //     bike.user == bikeMetadata.user &&
    //     bike.sizeName == sizeName
    //   ));
    // }), {
    //   sizeName: sizeName,
    //   make: bikeMetadata.make,
    //   model: bikeMetadata.model,
    //   image: image,
    //   rearWheelCenter: {x: destinationGeometry.rearWheelCenter!.x - leftMargin, y: destinationGeometry.rearWheelCenter!.y - topMargin},
    //   bottomBracketCenter: {x: destinationGeometry.bottomBracketCenter!.x - leftMargin, y: destinationGeometry.bottomBracketCenter!.y - topMargin},
    //   crankArmEnd: {x: destinationGeometry.crankArmEnd!.x - leftMargin, y: destinationGeometry.crankArmEnd!.y - topMargin},
    //   year : bikeMetadata.year,
    //   _id: bikeMetadata._id,
    //   user: bikeMetadata.user,
    //   isPublic: bikeMetadata.isPublic,
    //   data: null
    // }]);
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
          !destinationGeometry.frontWheelCenter ||
          !destinationGeometry.seatMount ||
          !destinationGeometry.handlebarMount
          // !destinationGeometry.orgPxPerMM || 
          // !destinationGeometry.desiredPxPerMM
        ) {
          return;
        }
        //almost, but actually need to use size of bike after scaling....
        const rearWheelCenter = destinationGeometry.rearWheelCenter;
        const frontWheelCenter = destinationGeometry.frontWheelCenter;
        const topPoint = destinationGeometry.seatMount.y < destinationGeometry.handlebarMount.y ? destinationGeometry.seatMount : destinationGeometry.handlebarMount;
        // const rate = destinationGeometry.desiredPxPerMM / destinationGeometry.orgPxPerMM;

        const estimatedMarginLeft = rearWheelCenter.x - geometryState.fixedCircles.rearWheel.radius * desiredPxPerMM;
        //let estimatedMarginLeft = 0;
        const estimatedMarginTop = Math.max(topPoint.y - 100 * desiredPxPerMM, 0);

        const estimatedWidth = frontWheelCenter.x + geometryState.fixedCircles.frontWheel.radius * desiredPxPerMM - estimatedMarginLeft;
        const estimatedHeight = frontWheelCenter.y + geometryState.fixedCircles.frontWheel.radius * desiredPxPerMM  - estimatedMarginTop;

        

        // estimatedWidth = estimatedWidth / pxPerMm!;
        // estimatedHeight = estimatedHeight / pxPerMm!;
        const imageSvg = canvasState.canvas.toSVG(
          {
            width: estimatedWidth,
            height: estimatedHeight,
            viewBox: {
              x: estimatedMarginLeft,
              y: estimatedMarginTop,
              width: estimatedWidth,
              height: estimatedHeight
            }
          }
        );

        // console.log(imageSvg);
        // setImage(imageSvg, estimatedMarginLeft, estimatedMarginTop);
        // setBikeDrawn(true);

        const svgDataBase64 = btoa(unescape(encodeURIComponent(imageSvg)))
        const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

        const image = new Image()

        image.addEventListener('load', () => {
          const width = estimatedWidth
          const height = estimatedHeight
          const canvas = document.createElement('canvas')

          canvas.setAttribute('width', String(estimatedWidth))
          canvas.setAttribute('height', String(estimatedHeight))

          const context = canvas.getContext('2d')
          if (!context) {
            return;
          }
          context.drawImage(image, 0, 0, width, height)

          const dataUrl = canvas.toDataURL('image/png')
          //output.src = dataUrl

          setImage(dataUrl, estimatedMarginLeft, estimatedMarginTop);
          console.log(dataUrl);
          setBikeDrawn(true);
        })

        image.src = svgDataUrl
      }
      
    }, 2500)
  }, [geometryState, bikeMetadata, sizeName, canvasState, destinationGeometry]);

  return (
    <div>
      {/* <BackgroundImage desiredPxPerMM={desiredPxPerMM} opacity={0} focusPoint={null}/> */}
      <GeometryPointsFromMeasures 
        sizeMeasures={geometryState.sizesTable.get(sizeName)!}
        desiredPxPerMM={desiredPxPerMM}
        handlebarMeasurements={geometryState.handlebarsTable.get(sizeName)!}
        setDestinationGeometryPoints={setDestiantionGeometry}/>
        {!bikeDrawn && <PuffLoader style={{position: "absolute"}}/>}
      <div className='thumbnail-container'>
        <Canvas />
      </div>
    </div>
  );
};

export default CompareImageBuilder;
