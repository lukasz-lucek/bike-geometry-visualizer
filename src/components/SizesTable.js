// src/components/FrameGeometryInput.js
import React, { useEffect, useState } from 'react';

const SizesTable = ({state, updateState }) => {

  const sizesTable = state.sizesTable ? state.sizesTable : {};
  const knownSizes = Object.keys(sizesTable);

  const defaultSizes = {
    stack : 0,
    reach : 0,
    topTube : 0,
    seatTubeCT : 0,
    headAngle : 0,
    seatAngle : 0,
    headTube : 0,
    chainstay : 0,
    bbDrop : 0,
  }

  const measurements = Object.keys(defaultSizes);

  useEffect( () => {
    if (!state.sizesTable) {
      updateState({sizesTable : { 
        S: defaultSizes,
        M: defaultSizes,
        L: defaultSizes,
      }});
    }
  }, [state]);

    return (
        <div>
        <table>
          <thead>
            <tr>
              <th> Measure\Size </th>
              {knownSizes.map((size) => (
                <th key={'H'+size}>{size}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement) => (
              <tr key={'R'+measurement}>
                <td key={'H'+measurement}>{measurement}</td>
                {knownSizes.map((size) => (
                  <td key={'V'+size+measurement}>{state.sizesTable[size][measurement]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

export default SizesTable;
