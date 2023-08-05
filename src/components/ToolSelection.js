import React from 'react';

const ToolSelection = ({ selectedTool, handleToolSelect }) => {
  const tools = [
    { name: 'imageUpload', label: 'Image Upload Tool' },
    { name: 'frameGeometry', label: 'Geometry Specs' },
    // Add more tools here as needed
  ];

  return (
    <div className="toolbox">
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
