// src/components/ImageUploadOption.js
import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../contexts/CanvasContext.js'; // Import the useCanvasContext hook
import '../App.css';
import { useGeometryContext } from '../contexts/GeometryContext.js';
import BackgroundImage from "../components/BackgroundImage.js"

const ImageUploadOption = () => {
  const defaultState = {
    dragOver: false,
    selectedPoint: null,
  };
  const [state, setState] = useState(defaultState);
  const updateState = (newPartialState) => {
    setState({...state,...newPartialState});
  }
  const {
    state: [canvasState, ],
  } = useCanvasContext();

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const handleDrop = (e) => {
    e.preventDefault();
    updateState({dragOver: false});
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateGeometryState({selectedFile:reader.result});
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
    updateState({dragOver: true});
  };

  const handleDragLeave = () => {
    updateState({dragOver: false});
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      {state.dragOver ? 
        <div className="drop-indicator">Drop it - I'm ready</div> : 
        <div className="drop-indicator">You can drop images here</div>}
      <input type="file" onChange={handleFileInputChange} />
      {geometryState.selectedFile && <BackgroundImage key={'BackgroundImage'}/>}
    </div>
  );
};

export default ImageUploadOption;
