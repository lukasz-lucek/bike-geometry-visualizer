import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import {findAngle, findBB, findBBFromACoords, findBBFromImage} from '../utils/GeometryUtils.js'

export function RectangleGrabVisualization({canvas, rectangle, shape, imageSrc}) {

    const [loadedImage, setLoadedImage] = useState(null);
  
    useEffect(() => {
        const sh = shape.shape;
        const length = Math.sqrt(Math.pow(sh.x1-sh.x2,2) + Math.pow(sh.y1-sh.y2,2))
        const bound = findBB({x1: sh.x1, y1: sh.y1},{x2: sh.x2, y2: sh.y2},sh.width);
        if (bound) {
            const angle = findAngle({x1: sh.x1, y1: sh.y1},{x2: sh.x2, y2: sh.y2})
            fabric.Image.fromURL(imageSrc.src, (img) => {
                img.rotate(-angle);
                const bound2 = findBBFromImage (img);

                fabric.Image.fromURL(img.toDataURL(), (cimg) => {
                    setLoadedImage(cimg);
                },
                {
                    width: length,
                    height: sh.width,
                    cropY: (bound2.height - sh.width) / 2,
                    cropX: (bound2.width - length) / 2,
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

    }, [canvas, shape, imageSrc]);

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

export default RectangleGrabVisualization;