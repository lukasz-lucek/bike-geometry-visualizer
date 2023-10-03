import React, { useState } from 'react';
import './App.css';
import ToolSelection from './components/ToolSelection.js'; // Import the ToolSelection component
import ToolOptionsArea from './components/ToolOptionsArea.js'; // Import the ToolOptionsArea component
import { CanvasProvider } from './contexts/CanvasContext'; // Update the import path
import GeometryProvider from './contexts/GeometryContext';
import MeasurementsProvider from './contexts/MeasurementsContext';
import { Canvas } from './components/drawing/Canvas';



const App = () => {
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolSelect = (toolName) => {
    setSelectedTool(toolName);
  };

  return (
    <CanvasProvider>
      <GeometryProvider>
        <MeasurementsProvider>
          <div className="app-container">
            <div className="tool-selection-area">
              <ToolSelection selectedTool={selectedTool} handleToolSelect={handleToolSelect} />
            </div>
            <div className="tool-options-area">
              <ToolOptionsArea selectedTool={selectedTool} />
            </div>
            <div className="workspace">
              <Canvas/>
            </div>
          </div>
        </MeasurementsProvider>
      </GeometryProvider>
    </CanvasProvider>
  );
};

export default App;
