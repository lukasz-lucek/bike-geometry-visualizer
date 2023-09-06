import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function BackgroundImage({canvas, layer, angleOfRotation}) {
  const [fabricObject, setFabricObject] = useState([]);
  const [fabricObjectToRemember, setFabricObjectToRemember] = useState(null);

  const removeOldFabricObject = () => {
      if (fabricObject != null) {
          canvas.remove(fabricObject);
          canvas.renderAll();
      }
  }

  useEffect(() => {

    removeOldFabricObject();
    setFabricObject(null);

    canvas.setViewportTransform([1,0,0,1,0,0]);
    fabric.Image.fromURL(layer.src, (img) => {
        img.lockMovementX = true;
        img.lockMovementY = true;
        canvas.setZoom(Math.min(canvas.width / img.width, canvas.height / img.height));
        canvas.insertAt(img, 0);
        canvas.renderAll();
        canvas.selection = false;
        canvas.interactive = false;
        //stupid ugly hack to go ove the fact that in dev mode effects are called twice. 
        //If not for the timeout - the remembering does not work - only one image is remembered
        setTimeout(() => {
            setFabricObjectToRemember(img);
        }, 1000);
    });
  }, [layer, canvas]);

  useEffect(() => {
    if (fabricObjectToRemember != null) {
        removeOldFabricObject();

        setFabricObject(fabricObjectToRemember);
        setFabricObjectToRemember(null);
    }
    
  }, [fabricObjectToRemember]);

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