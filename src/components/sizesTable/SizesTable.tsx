// src/components/FrameGeometryInput.js
import React, { useEffect, useState } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import { Measures, useMeasurementsContext } from '../../contexts/MeasurementsContext';
import GeometryPointsFromMeasures from '../stitchers/GeometryPointsFromMeasures';

const SizesTable = () => {
  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const {
    state: [mState,],
  } = useMeasurementsContext();

  const [sizeName, setSizeName] = useState('');
  const [highlightedSize, setHighlightedSize] = useState<string | null>();

  // const sizesTable = geometryState.sizesTable ? geometryState.sizesTable : {};
  const knownSizes = Array.from(geometryState.sizesTable.keys());

  const defaultSizes = {
    ...mState.measures,
  }
  const measurements: (keyof Measures)[] = Object.keys(defaultSizes) as (keyof Measures)[];

  useEffect(() => {

    // TODO move uninitialized values handling somewhere else
    if (!geometryState.sizesTable) {
      updateGeometryState({ sizesTable: new Map() });
    }
  }, [geometryState, mState.measures]);

  const addSizeToTable = () => {
    let ns = new Map(geometryState.sizesTable);
    ns.set(sizeName, mState.measures);
    updateGeometryState({ sizesTable: ns });
  }

  const removeSizeVromTable = (name: string) => {
    const newState = new Map(geometryState.sizesTable);
    newState.delete(name);
    updateGeometryState({ sizesTable: newState });
  }

  const nameTaken = () => {
    return geometryState.sizesTable && sizeName in geometryState.sizesTable;
  }

  const setMeasureValue = (newVal: number, size: string, measurement: keyof Measures) => {

    const newState = new Map(geometryState.sizesTable);
    let changedSize = newState.get(size);
    if (!changedSize) {
      return;
    }
    changedSize[measurement] = newVal;
    updateGeometryState({ sizesTable: newState });
  }

  return (
    <div>
      <p>
        <input
          type="text"
          placeholder="Size name"
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)} />
        <button
          disabled={sizeName == '' || nameTaken()}
          onClick={() => addSizeToTable()}>
          {nameTaken() ? "Name already Used" : "Add size"}
        </button>
      </p>
      <table>
        <thead>
          <tr>
            <th> Measure\Size </th>
            {knownSizes.map((size) => (
              <th key={'H' + size}>
                <p>
                  {size}
                  <button onClick={() => removeSizeVromTable(size)}>Rem</button>
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement) => (
            <tr key={'R' + measurement}>
              <td key={'H' + measurement}>{measurement}</td>
              {knownSizes.map((size) => (
                <td
                  key={'V' + size + measurement}
                  onMouseEnter={() => { setHighlightedSize(size) }}
                  onMouseLeave={() => { setHighlightedSize(null) }}>
                  <input
                    value={geometryState.sizesTable.get(size)![measurement] ? geometryState.sizesTable.get(size)![measurement].toFixed(0) : 0}
                    onChange={(e) => setMeasureValue(Number(e.target.value), size, measurement)}
                    type="number" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {highlightedSize && <GeometryPointsFromMeasures sizeMeasures={geometryState.sizesTable.get(highlightedSize)!} desiredPxPerMM={1} />}
    </div>
  );
};

export default SizesTable;
