import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function BackgroundImage({canvas, imageSrc, angleOfRotation}) {
  const [fabricObject, setFabricObject] = useState(null);

  useEffect(() => {
    canvas.setViewportTransform([1,0,0,1,0,0]);
    fabric.Image.fromURL(imageSrc, (img) => {
        img.lockMovementX = true;
        img.lockMovementY = true;
        canvas.setZoom(Math.min(canvas.width / img.width, canvas.height / img.height));
        canvas.selection = false;
        canvas.interactive = false;
        setFabricObject(img);
    });
  }, [imageSrc, canvas]);

  useEffect(() => {
    if (fabricObject != null) {
      canvas.insertAt(fabricObject, 0);
      canvas.renderAll();
      return () => {
        canvas.remove(fabricObject);
        canvas.renderAll();
      }
    }
    
  }, [fabricObject]);

  useEffect(() => {
    if (fabricObject && angleOfRotation > 0) {
      fabricObject.rotate(angleOfRotation);
      canvas.renderAll();
    }
  }, [angleOfRotation]);

  return (
    <>
    </>
  );
}

export default BackgroundImage;