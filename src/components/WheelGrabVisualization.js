import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import {findCircleBB} from '../utils/GeometryUtils.js'
import { useGeometryContext } from '../contexts/GeometryContext.js';

export function WheelGrabVisualization({canvas, shape}) {

    const {
        state: [geometryState, ],
    } = useGeometryContext();

    const [loadedImage, setLoadedImage] = useState(null);
  
    useEffect(() => {
        const sh = shape.shape;
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
                    top: sh.y - 3*sh.radius - 30,
                    left: sh.x-sh.radius,
                    width: bound.width,
                    height: bound.height,
                    cropX: bound.left,
                    cropY: bound.top,
                });
                return () => {
                    setLoadedImage(null);
                }
            }
        }
    }, [canvas, shape, geometryState.selectedFile]);

    useEffect(() => {
        if (loadedImage) {
            canvas.insertAt(loadedImage, 3);
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