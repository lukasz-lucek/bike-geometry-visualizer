import React from 'react';
import 'react-select-search/style.css'

const ToolSelection = ({
  selectedTool,
  handleToolSelect
}: {
  selectedTool: string;
  handleToolSelect: (val: string) => void;
}) => {
  const tools = [
    // { name: 'imageUpload', label: 'Image Upload Tool' },
    { name: 'imageGeometryGrabber', label: 'Image Geometry Grabbing' },
    { name: 'handlebarsGeometry', label: 'Handlebar Geometry Grabbing'},
    { name: 'seatGeometry', label: 'Seat Geometry Grabbing'},
    { name: 'frameGeometry', label: 'Geometry Specs' },
    // Add more tools here as needed
  ];

  return (
    <div className="toolbox">
      {/* {tools.map((tool) => (
        <button
          key={tool.name}
          className={`tool ${selectedTool === tool.name ? 'selected' : ''}`}
          onClick={() => handleToolSelect(tool.name)}
        >
          {tool.label}
        </button>
      ))} */}
    </div>
  );
};

export default ToolSelection;
