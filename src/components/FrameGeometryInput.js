// src/components/FrameGeometryInput.js
import React, { useState } from 'react';

const FrameGeometryInput = () => {
  const [size, setSize] = useState('');
  const [reach, setReach] = useState('');
  const [stack, setStack] = useState('');
  // ... add more state variables for other parameters

  const handleAddFrame = () => {
    if (size && reach && stack) {

      setSize('');
      setReach('');
      setStack('');
      // ... reset other state variables
    }
  };

  return (
    <div className="frame-input">
      <h3>Add Frame Geometry Parameters</h3>
      <label>
        Size:
        <input type="text" value={size} onChange={(e) => setSize(e.target.value)} />
      </label>
      <label>
        Reach:
        <input type="text" value={reach} onChange={(e) => setReach(e.target.value)} />
      </label>
      <label>
        Stack:
        <input type="text" value={stack} onChange={(e) => setStack(e.target.value)} />
      </label>
      {/* Add more input fields for other parameters */}
      <button onClick={handleAddFrame}>Add Frame</button>
    </div>
  );
};

export default FrameGeometryInput;
