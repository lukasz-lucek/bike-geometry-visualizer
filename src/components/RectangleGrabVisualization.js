import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import {findAngle, findBBWithMargins, findBBFromImage, findDistance} from '../utils/GeometryUtils.js'
import { useGeometryContext } from '../contexts/GeometryContext.js';

export function RectangleGrabVisualization({canvas, shape, leftPlacementPoint=null, rightPlacementPoint=null, layer=3}) {

    const {
        state: [geometryState, ],
    } = useGeometryContext();

    const [loadedImage, setLoadedImage] = useState(null);
  
    useEffect(() => {
        const sh = shape.shape;
        const margin = 35;
        let scale = 1;
        if (leftPlacementPoint && rightPlacementPoint) {
            const orgDistance = findDistance({x: sh.x1, y: sh.y1}, {x: sh.x2, y: sh.y2});
            const newDistance = findDistance(leftPlacementPoint, rightPlacementPoint);
            scale = newDistance / orgDistance;
        }
        if (geometryState.selectedFile) {
            const bound = findBBWithMargins({x1: sh.x1, y1: sh.y1},{x2: sh.x2, y2: sh.y2},sh.width, margin);
            if (bound) {

                // const rect = new fabric.Rect({
                //     ...bound,
                //     fill: 'transparent',
                //     stroke: 'green',
                //     strokeWidth: 1,
                // });
                // canvas.insertAt(rect, 5);

                const angle = findAngle({x: sh.x1, y: sh.y1},{x: sh.x2, y: sh.y2})
                fabric.Image.fromURL(geometryState.selectedFile, (img) => {
                    img.rotate(-angle);
                    const bound2 = findBBFromImage (img);
                    const length = Math.sqrt(Math.pow(sh.x1-sh.x2,2) + Math.pow(sh.y1-sh.y2,2));

                    fabric.Image.fromURL(img.toDataURL(), (cimg) => {
                        if (leftPlacementPoint && rightPlacementPoint) {
                            const landingAngle = findAngle(leftPlacementPoint, rightPlacementPoint);
                            const landingPoint = {
                                x: (leftPlacementPoint.x + rightPlacementPoint.x)/2,
                                y: (leftPlacementPoint.y + rightPlacementPoint.y)/2,
                            }
                            fabric.Image.fromURL(cimg.toDataURL(), (movedImage) => {
                                movedImage.rotate(landingAngle);
                                setLoadedImage(movedImage);
                            },{
                                top: landingPoint.y - scale*cimg.height/2,
                                left: landingPoint.x - scale*cimg.width/2,
                            });
                        } else {
                            setLoadedImage(cimg);
                        }
                    },
                    {
                        width: length+margin,
                        height: sh.width,
                        scaleX: scale,
                        scaleY: scale,
                        cropY: (bound2.height - sh.width) / 2,
                        cropX: (bound2.width - length - margin) / 2,
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

export default RectangleGrabVisualization;