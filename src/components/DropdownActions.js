// src/components/DropdownActions.js
import React, { useState } from 'react';

const DropdownActions = ({ items, onLoad, onRemove }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedItem(selectedValue);
    setButtonsEnabled(true);
  };

  const handleLoadClick = () => {
    if (onLoad) {
      onLoad(selectedItem); // Call the provided onLoad callback
    }
    setSelectedItem('');
    setButtonsEnabled(false);
  };

  const handleRemoveClick = () => {
    if (onRemove) {
      onRemove(selectedItem); // Call the provided onRemove callback
    }
    setSelectedItem('');
    setButtonsEnabled(false);
  };

  if (items.length === 0) {
    return <p>No items available.</p>;
  }

  return (
    <div className="dropdown-actions">
      <select value={selectedItem} onChange={handleDropdownChange}>
        <option value="">Select an item</option>
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button onClick={handleLoadClick} disabled={!buttonsEnabled}>
        Load
      </button>
      <button onClick={handleRemoveClick} disabled={!buttonsEnabled}>
        Remove
      </button>
    </div>
  );
};

export default DropdownActions;
