// src/components/DropdownActions.js
import React, { ChangeEvent, useState } from 'react';

interface DropdownActionsProps {
  items : string[];
  onLoad : (s: string) => void;
  onRemove : (s : string) => void;
}

const DropdownActions = ({ items, onLoad, onRemove } : DropdownActionsProps) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

  const handleDropdownChange = (event : ChangeEvent<HTMLSelectElement>) => {
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
