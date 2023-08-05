// src/components/ImageUploadOption.js
import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js'; // Import the useCanvasContext hook
import '../App.css';

const ImageUploadOption = ({ selectedTool }) => {
  const [dragOver, setDragOver] = useState(false);
  const {
    addLayer: [addLayerToCanvasFunc, ],
    enablePointPicker: [enablePointPickerFunc, ],
    pointSelected: [, setPointSelected],
  } = useCanvasContext(); // Access the addLayerToCanvas method from context
  const [wheelbase, setWheelbase] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);


  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newLayer = {
        type: 'image',
        src: reader.result,
      };
      addLayerToCanvasFunc(newLayer); // Add the new layer to the canvas
      //onImageAdd(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleAddPoint = (pointType) => {
    setSelectedPoint(pointType);
    enablePointPickerFunc(true, "#FFFFFF");
  };

  const handleCanvasClick = (x, y) => {
    console.log("ooooooo handleCanvasClick");
    if (selectedPoint) {
      console.log("for selected point", selectedPoint, " x = ", x, " y = ", y);
      //const canvas = canvasRef.current;
      //const rect = canvas.getBoundingClientRect();
      //const x = event.clientX - rect.left;
      //const y = event.clientY - rect.top;

      // Add logic to place a marker or handle the selected point
      // ...

      setSelectedPoint(null); // Reset selected point after placing
      enablePointPickerFunc(false, "#FFFFFF");
    }
  };

  useEffect(() => {
    console.log("selected tool: ", selectedTool);
    setPointSelected(() => handleCanvasClick);

    // Clean up event listeners when the component unmounts
    return () => {
      console.log("cleaning up");
      setPointSelected(() => null);
    };
  }, [selectedTool, selectedPoint]);

  //setPointSelected(() => handleCanvasClick);

  return (
    <div className="image-upload-option" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      {dragOver ? 
        <div className="drop-indicator">Drop it - I'm ready</div> : 
        <div className="drop-indicator">You can drop images here</div>}
      <input type="file" onChange={handleFileInputChange} />
      <input
        type="text"
        placeholder="Wheelbase (mm)"
        value={wheelbase}
        onChange={(e) => setWheelbase(e.target.value)}
      />
      <div className="point-buttons">
      <button
          className={selectedPoint === 'rearWheelCenter' ? 'selected-rear-wheel-center' : ''}
          onClick={() => handleAddPoint('rearWheelCenter')}
        >
          Rear Wheel Center
        </button>
        <button
          className={selectedPoint === 'frontWheelCenter' ? 'selected-front-wheel-center' : ''}
          onClick={() => handleAddPoint('frontWheelCenter')}
        >
          Front Wheel Center
        </button>
        <button
          className={selectedPoint === 'bottomBracketCenter' ? 'selected-bottom-bracket-center' : ''}
          onClick={() => handleAddPoint('bottomBracketCenter')}
        >
          Bottom Bracket Center
        </button>
        <button
          className={selectedPoint === 'headTubeTop' ? 'selected-head-tube-top' : ''}
          onClick={() => handleAddPoint('headTubeTop')}
        >
          Head Tube Top
        </button>
        <button
          className={selectedPoint === 'headTubeBottom' ? 'selected-head-tube-bottom' : ''}
          onClick={() => handleAddPoint('headTubeBottom')}
        >
          Head Tube Bottom
        </button>
        <button
          className={selectedPoint === 'seatTubeTop' ? 'selected-seat-tube-top' : ''}
          onClick={() => handleAddPoint('seatTubeTop')}
        >
          Seat Tube Top
        </button>
      </div>
    </div>
  );
};

export default ImageUploadOption;
