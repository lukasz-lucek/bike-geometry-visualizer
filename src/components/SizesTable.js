// src/components/FrameGeometryInput.js
import React, { useEffect, useState } from 'react';
import { useMeasurementsContext } from '../contexts/MeasurementsContext';
import GeometryPointsFromMeasures from './GeometryPointsFromMeasures';

const SizesTable = ({state, updateState }) => {
  const [sizeName, setSizeName] = useState('');
  const [highlightedSize, setHighlightedSize] = useState();

  const sizesTable = state.sizesTable ? state.sizesTable : {};
  const knownSizes = Object.keys(sizesTable);

  const {
    state: [mState, ],
  } = useMeasurementsContext(); 

  const defaultSizes = {
    ...mState.measures,
  }
  const measurements = Object.keys(defaultSizes);

  useEffect( () => {
    const defaultSizes = {
      ...mState.measures,
    }

    if (!state.sizesTable) {
      updateState({sizesTable : { 
      }});
    }
  }, [state, mState.measures]);

  const addSizeToTable = (name) => {
    const ns = {...state.sizesTable, ...Object.fromEntries([[name, mState.measures]])};
    updateState({sizesTable : JSON.parse(JSON.stringify(ns))});
  }

  const removeSizeVromTable = (name) => {
    const newState = Object.fromEntries(
      Object.entries(state.sizesTable).filter(([key]) =>
          key !== name));
    updateState({sizesTable : newState});
  }

  const nameTaken = (name) => {
    return state.sizesTable && sizeName in state.sizesTable;
  }

  const setMeasureValue = (newVal, size, measurement) => {
    const newState = state.sizesTable;
    newState[size][measurement] = newVal;
    updateState({sizesTable : newState});
  }

  return (
      <div>
        <p>
          <input 
            type="text"
            placeholder="Size name"
            value={sizeName}
            onChange={(e) => setSizeName(e.target.value)}/>
            <button 
              disabled={sizeName == '' || nameTaken(sizeName)}
              onClick={() => addSizeToTable(sizeName)}>
              {nameTaken(sizeName) ? "Name already Used" : "Add size"}
            </button>
          </p>
      <table>
        <thead>
          <tr>
            <th> Measure\Size </th>
            {knownSizes.map((size) => (
              <th key={'H'+size}>
                <p>
                  {size}
                  <button onClick={() => removeSizeVromTable(size)}>Remove</button>
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement) => (
            <tr key={'R'+measurement}>
              <td key={'H'+measurement}>{measurement}</td>
              {knownSizes.map((size) => (
                <td 
                  key={'V'+size+measurement}
                  onMouseEnter={() => {setHighlightedSize(size)}} 
                  onMouseLeave={() => {setHighlightedSize(null)}}>
                  <input
                    value={state.sizesTable[size][measurement].toFixed(0)}
                    onChange={(e) => setMeasureValue(Number(e.target.value), size, measurement)}
                    type="number"/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {highlightedSize && <GeometryPointsFromMeasures sizeMeasures={state.sizesTable[highlightedSize]} desiredPxPerMM={1}/> }
    </div>
  );
};

export default SizesTable;
