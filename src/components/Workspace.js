// src/components/Workspace.js
import React, { useRef, useEffect, useState} from 'react';
import { useCanvasContext } from '../contexts/CanvasContext';
import { Canvas } from '../components/Canvas.js';
import PointPickerControls from './PointPickerControls.js'; // Import the ImageUploadOption component

const Workspace = ( ) => {
  const [canvas, setCanvas] = useState(null);

  const {
    state: [, updateCanvasState],
  } = useCanvasContext();

  useEffect(() => {
    updateCanvasState({
      canvas: canvas,
    });
  }, [canvas]);
  
  return (
    <div className="workspace">
      <Canvas setCanvas={setCanvas}>
      </Canvas>
    </div>
  );
};

export default Workspace;
