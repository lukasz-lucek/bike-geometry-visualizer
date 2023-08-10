// src/components/Workspace.js
import React, { useRef, useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js';
import { Canvas } from '../components/Canvas.js';
import Visualizer from './VIsualizer.js'; // Import the ImageUploadOption component

const Workspace = ( ) => {
  const [canvas, setCanvas] = useState(null);

  const {
    state: [, updateContextState],
  } = useCanvasContext();

  const visualizerRef = useRef(null);

  const addNewLayer = (layer) => {
    console.log("workspace: addNewLayer");
    visualizerRef.current.addNewLayer(layer);
  }

  const enablePointPicker = (color)  => {
    console.log("workspace: enablePointPicker");
    return visualizerRef.current.enablePointPicker(color);
  };

  const disablePointPicker = () => {
    visualizerRef.current.disablePointPicker();
  }

  const addShapeVisualizationFunc = (key, shape, color) => {
    visualizerRef.current.addShapeVisualizationFunc(key, shape, color);
  }

  useEffect(() => {

    updateContextState({
      addLayerToCanvasFunc : addNewLayer,
      enablePointPickerFunc : enablePointPicker,
      disablePointPickerFun : disablePointPicker,
      addShapeVisualizationFunc : addShapeVisualizationFunc,
    });

  }, [canvas]);
  
  return (
    <div className="workspace">
      <Canvas setCanvas={setCanvas}>
        {canvas && <Visualizer ref={visualizerRef} canvas={canvas}/>}
      </Canvas>
    </div>
  );
};

export default Workspace;
