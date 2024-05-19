import React, { useState } from 'react';
import '../App.css';
import ToolSelection from './basicOptions/ToolSelection'; // Import the ToolSelection component
import ToolOptionsArea from './basicOptions/ToolOptionsArea'; // Import the ToolOptionsArea component
import { CanvasProvider } from '../contexts/CanvasContext'; // Update the import path
import GeometryProvider from '../contexts/GeometryContext';
import MeasurementsProvider from '../contexts/MeasurementsContext';
import { Canvas } from './drawing/Canvas';
import { useAuthContext } from '../contexts/AuthContext';
import AdminPanel from './adminTools/AdminPanel';



const MainComponent = () => {
  const [selectedTool, setSelectedTool] = useState('');
  const auth = useAuthContext();

  const handleToolSelect = (toolName: string) => {
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
        <Canvas />
      </div>
    </div>
    {(auth.authState.isAdmin) &&
      <AdminPanel></AdminPanel>  
    }
    </MeasurementsProvider>
    </GeometryProvider>
    </CanvasProvider>
  );
};

export default MainComponent;
