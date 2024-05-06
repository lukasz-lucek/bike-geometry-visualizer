// src/components/ToolOptionsArea.js
import React from 'react';
import ImageUploadOption from './ImageUploadOption'; // Import the ImageUploadOption component
import FrameGeometryInput from './FrameGeometryInput'; // Import the ImageUploadOption component
import ImageGeometryGrabber from './ImageGeometryGrabber';
import HandlebarGeometryGrabber from './HandlebarGeometryGrabber';
import SeatGeometryGrabber from './SeatGeometryGrabber';

const ToolOptionsArea = ({ selectedTool }: { selectedTool: string }) => {
  const renderToolOptions = () => {
    switch (selectedTool) {
      case 'imageUpload':
        return <ImageUploadOption />;
      case 'frameGeometry':
        return <FrameGeometryInput />;
      case 'handlebarsGeometry':
        return <HandlebarGeometryGrabber />;
      case 'seatGeometry':
          return <SeatGeometryGrabber />;
      case 'imageGeometryGrabber':
        return <ImageGeometryGrabber />;
      // Add more cases for other tools and their options components here
      default:
        return null;
    }
  };

  return (
    <div>
      {renderToolOptions()}
    </div>
  );
};

export default ToolOptionsArea;
