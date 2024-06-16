
import React, { useState } from 'react';
import {useGeometryContext } from '../../contexts/GeometryContext';
import axios from 'axios';
import { IBikeData } from '../../IGeometryState';
import { GeompetryPayloadSerializer } from '../../contexts/GeometryStatesSerilizer';

const GeometrySaver = () => {

  const [bikeMake, setBikeMake] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [bikeYear, setBikeYear] = useState(2020);

  const {
    state: [state],
  } = useGeometryContext();

  const sendGeometryUpstream = async () => {
    console.log(`sending upstream bike: ${bikeMake}, ${bikeModel}, ${bikeYear}`);
    const payload : IBikeData = {
      _id: null,
      make: bikeMake,
      model: bikeModel,
      year: bikeYear,
      user: '',
      isPublic: false,
      data: state,
    }
    const serializer = new GeompetryPayloadSerializer(payload)
    const prepPayload = serializer.serialize();
    console.log(prepPayload);

    const address = process.env.REACT_APP_SERVER_ADDRESS || '';
    const endpoint = address + '/api/bike'

    const token = localStorage.getItem('jwt');
    axios.post(endpoint, prepPayload, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }).then(function (resp) {
      console.log(resp);
    }).catch(function (error) {
      console.log(error);
    });
    //console.log(`about to sent data: ${prepPayload}`);
  }

  return (
    <div>
      <p>
        <input
          type="text"
          placeholder="Make"
          value={bikeMake}
          onChange={(e) => setBikeMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          value={bikeModel}
          onChange={(e) => setBikeModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={bikeYear}
          onChange={(e) => setBikeYear(parseInt(e.target.value))}
        />
        <button disabled={bikeMake == '' || bikeModel == '' || bikeYear == 0 || state.selectedFile == null} onClick={() => sendGeometryUpstream()}>Create</button>
      </p>
    </div>
  );
};

export default GeometrySaver;
