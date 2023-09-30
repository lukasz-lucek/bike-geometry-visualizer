import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import {findCircleBB} from '../utils/GeometryUtils.js'
import { useGeometryContext } from '../contexts/GeometryContext';

export function WheelGrabVisualization({canvas, shape, placementPoint=null, scale=1, layer=3}) {

    const {
        state: [geometryState, ],
    } = useGeometryContext();

    const [loadedImage, setLoadedImage] = useState(null);
  
    useEffect(() => {
        const sh = shape.shape;

        let top = sh.y - 3*sh.radius - 30;
        let left = sh.x-sh.radius;
        
        if (placementPoint != null) {
            top = placementPoint.y - sh.radius * scale;
            left = placementPoint.x - sh.radius * scale;
        }
        
        if (geometryState.selectedFile) {
            const bound = findCircleBB(sh.x, sh.y, sh.radius);
            if (bound) {
                fabric.Image.fromURL(geometryState.selectedFile, (img) => {
                    img.set({
                        clipPath: new fabric.Circle({
                            radius: sh.radius,
                            originX: 'center',
                            originY: 'center',
                            startAngle: sh.startAngle,
                            endAngle: sh.endAngle,
                        })
                    });
                    setLoadedImage(img);
                },
                {
                    top: top,
                    left: left,
                    width: bound.width,
                    height: bound.height,
                    scaleX: scale,
                    scaleY: scale,
                    cropX: bound.left,
                    cropY: bound.top,
                });
                return () => {
                    setLoadedImage(null);
                }
            }
        }
    }, [canvas, shape, geometryState.selectedFile, placementPoint, scale]);

    useEffect(() => {
        if (loadedImage) {
            canvas.insertAt(loadedImage, layer);
            canvas.renderAll();
            return () => {
                canvas.remove(loadedImage);
                canvas.renderAll();
            }
        }
    }, [loadedImage]);

  return (
    <>
    </>
  );
}

export default WheelGrabVisualization;