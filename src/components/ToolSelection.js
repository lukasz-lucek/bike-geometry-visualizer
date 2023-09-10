import React from 'react';
import GeometrySaver from './GeometrySaver';

const ToolSelection = ({ selectedTool, handleToolSelect }) => {
  const tools = [
    { name: 'imageUpload', label: 'Image Upload Tool' },
    { name: 'imageGeometryGrabber', label: 'Image Geometry Grabbing' },
    { name: 'frameGeometry', label: 'Geometry Specs' },
    // Add more tools here as needed
  ];

  return (
    <div className="toolbox">
      <GeometrySaver/>
      {tools.map((tool) => (
        <button
          key={tool.name}
          className={`tool ${selectedTool === tool.name ? 'selected' : ''}`}
          onClick={() => handleToolSelect(tool.name)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};

export default ToolSelection;
