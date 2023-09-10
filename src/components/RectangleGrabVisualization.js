import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import {findAngle, findBBWithMargins, findBBFromImage} from '../utils/GeometryUtils.js'
import { useGeometryContext } from '../contexts/GeometryContext.js';

export function RectangleGrabVisualization({canvas, shape}) {

    const {
        state: [geometryState, ],
    } = useGeometryContext();

    const [loadedImage, setLoadedImage] = useState(null);
  
    useEffect(() => {
        const sh = shape.shape;
        if (geometryState.selectedFile) {
            const bound = findBBWithMargins({x1: sh.x1, y1: sh.y1},{x2: sh.x2, y2: sh.y2},sh.width);
            if (bound) {

                // const rect = new fabric.Rect({
                //     ...bound,
                //     fill: 'transparent',
                //     stroke: 'green',
                //     strokeWidth: 1,
                // });
                // canvas.insertAt(rect, 5);

                const angle = findAngle({x1: sh.x1, y1: sh.y1},{x2: sh.x2, y2: sh.y2})
                fabric.Image.fromURL(geometryState.selectedFile, (img) => {
                    img.rotate(-angle);
                    const bound2 = findBBFromImage (img);
                    const length = Math.sqrt(Math.pow(sh.x1-sh.x2,2) + Math.pow(sh.y1-sh.y2,2));

                    fabric.Image.fromURL(img.toDataURL(), (cimg) => {
                        setLoadedImage(cimg);
                    },
                    {
                        width: length+sh.width,
                        height: sh.width,
                        cropY: (bound2.height - sh.width) / 2,
                        cropX: (bound2.width - length - sh.width) / 2,
                    })
                },
                {
                    top: 0,
                    left: 0,
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
            console.log("Adding immage - to layer3")
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

export default RectangleGrabVisualization;