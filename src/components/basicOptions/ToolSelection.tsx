import React from 'react';
import GeometrySaver from '../storage/GeometrySaver';

const ToolSelection = ({
  selectedTool,
  handleToolSelect
} : {
  selectedTool: string;
  handleToolSelect: (val: string) => void;
}) => {
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
