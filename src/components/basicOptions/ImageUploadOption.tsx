// src/components/ImageUploadOption.js
import React, { DragEvent, FormEvent, useState } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"

const ImageUploadOption = () => {


  const [dragOver, setDragOver] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateGeometryState({ selectedFile: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) {
      return;
    }
    const file = e.currentTarget.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      {dragOver ?
        <div className="drop-indicator">Drop it - I'm ready</div> :
        <div className="drop-indicator">You can drop images here</div>}
      <input type="file" onChange={handleFileInputChange} />
      {geometryState.selectedFile && <BackgroundImage isGrayedOut={false} desiredPxPerMM={null} />}
    </div>
  );
};

export default ImageUploadOption;
