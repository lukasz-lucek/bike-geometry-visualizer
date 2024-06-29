
import React from 'react';
import { useGeometryContext } from '../../../contexts/GeometryContext';
import CompareToggleButton from '../../compare/CompareToggleButton';

const SizesList = () => {

  const {
    state: [geometryState, ],
  } = useGeometryContext();

  return (
    <table>
      <thead>
        <tr>
          <th> Size </th>
          <th> Comparison </th>
          <th> Geometry </th>
        </tr>
      </thead>
      <tbody>
      {Array.from(geometryState.sizesTable.keys()).map((name) => (
        <tr key={`tr${name}`}>
          <td>{name}</td>
          <td><CompareToggleButton sizeName={name}/></td>
          <td><button> Edit </button></td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default SizesList;
