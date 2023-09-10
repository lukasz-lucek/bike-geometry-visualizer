// src/components/ToolOptionsArea.js
import React from 'react';
import ImageUploadOption from './ImageUploadOption'; // Import the ImageUploadOption component
import FrameGeometryInput from './FrameGeometryInput'; // Import the ImageUploadOption component
import ImageGeometryGrabber from './ImageGeometryGrabber';

const ToolOptionsArea = ({ selectedTool }) => {
  const renderToolOptions = () => {
    switch (selectedTool) {
      case 'imageUpload':
        return <ImageUploadOption />;
      case 'frameGeometry':
        return <FrameGeometryInput />;
      case 'imageGeometryGrabber':
          return <ImageGeometryGrabber />;
      // Add more cases for other tools and their options components here
      default:
        return null;
    }
  };

  return (
    <div className="tool-options-area">
      {renderToolOptions()}
    </div>
  );
};

export default ToolOptionsArea;
