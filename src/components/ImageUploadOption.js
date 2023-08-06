// src/components/ImageUploadOption.js
import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js'; // Import the useCanvasContext hook
import BikeGeometryTable from '../components/BikeGeometryTable.js';
import '../App.css';

const ImageUploadOption = ({ selectedTool }) => {
  const {
    addLayer: [addLayerToCanvasFunc, ],
    enablePointPicker: [enablePointPickerFunc, ],
    pointSelected: [, setPointSelected],
  } = useCanvasContext(); // Access the addLayerToCanvas method from context
  const [dragOver, setDragOver] = useState(false);
  const [wheelbase, setWheelbase] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [geometryPoints, setGeometryPoints] = useState([]);


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

  const handleAddPoint = (pointType, style, backupStyle) => {
    let button = document.querySelector(style, 'hover');
    if (button == null) {
      button = document.querySelector(backupStyle);
    }
    const computedStyle = getComputedStyle(button);
    const color = computedStyle.getPropertyValue("background-color");
    console.log(color);
    setSelectedPoint(pointType);
    enablePointPickerFunc(true, color);
  };

  const handleCanvasClick = (x, y) => {
    console.log("ooooooo handleCanvasClick");
    if (selectedPoint) {
      setGeometryPoints({...geometryPoints,[selectedPoint]: {x: x, y: y}});
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
          className={selectedPoint === 'rearWheelCenter' ? 'selected-rear-wheel-center' : 'rear-wheel-center'}
          onClick={() => handleAddPoint('rearWheelCenter', '.rear-wheel-center', '.selected-rear-wheel-center')}
        >
          Rear Wheel Center
        </button>
        <button
          className={selectedPoint === 'frontWheelCenter' ? 'selected-front-wheel-center' : 'front-wheel-center'}
          onClick={() => handleAddPoint('frontWheelCenter', '.front-wheel-center', '.selected-front-wheel-center')}
        >
          Front Wheel Center
        </button>
        <button
          className={selectedPoint === 'bottomBracketCenter' ? 'selected-bottom-bracket-center' : 'bottom-bracket-center'}
          onClick={() => handleAddPoint('bottomBracketCenter', '.bottom-bracket-center', '.selected-bottom-bracket-center')}
        >
          Bottom Bracket Center
        </button>
        <button
          className={selectedPoint === 'headTubeTop' ? 'selected-head-tube-top' : 'head-tube-top'}
          onClick={() => handleAddPoint('headTubeTop', '.head-tube-top', '.selected-head-tube-top')}
        >
          Head Tube Top
        </button>
        <button
          className={selectedPoint === 'headTubeBottom' ? 'selected-head-tube-bottom' : 'head-tube-bottom'}
          onClick={() => handleAddPoint('headTubeBottom', '.head-tube-bottom', '.selected-head-tube-bottom')}
        >
          Head Tube Bottom
        </button>
        <button
          className={selectedPoint === 'seatTubeTop' ? 'selected-seat-tube-top' : 'seat-tube-top'}
          onClick={() => handleAddPoint('seatTubeTop', '.seat-tube-top', '.selected-seat-tube-top')}
        >
          Seat Tube Top
        </button>
        <BikeGeometryTable points={geometryPoints} wheelbase={wheelbase}/>
      </div>
    </div>
  );
};

export default ImageUploadOption;
