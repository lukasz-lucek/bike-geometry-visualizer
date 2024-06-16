import React, { useState } from 'react';
import '../App.css';
import ToolSelection from './basicOptions/ToolSelection'; // Import the ToolSelection component
import ToolOptionsArea from './basicOptions/ToolOptionsArea'; // Import the ToolOptionsArea component
import { CanvasProvider } from '../contexts/CanvasContext'; // Update the import path
import GeometryProvider from '../contexts/GeometryContext';
import MeasurementsProvider from '../contexts/MeasurementsContext';
import { Canvas } from './drawing/Canvas';
import UserInfo from './login/UserInfo';
import MainMenu from './mainMenu/MainMenu';
import BikeInfo from './login/BikeInfo';
import ComparisonProvider from '../contexts/ComparisonContext';



const MainComponent = () => {
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
  };

  return (
    <CanvasProvider>
    <GeometryProvider>
    <MeasurementsProvider>
    <ComparisonProvider>
    <div className="app-container">
      <div className="main-menu-area">
        <UserInfo/>
        <BikeInfo/>
        <MainMenu/>
      </div>
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
    </ComparisonProvider>
    </MeasurementsProvider>
    </GeometryProvider>
    </CanvasProvider>
  );
};

export default MainComponent;
