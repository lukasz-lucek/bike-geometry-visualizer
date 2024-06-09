
import React, { useEffect, useState } from 'react';
import { getAxiosInstance } from '../../utils/AxiosUtils';
import { IBikeData } from '../../IGeometryState';
import { GeometryState, useGeometryContext } from '../../contexts/GeometryContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { cloneBikeInStorage, loadBikeFromStorage, removeBikeFromStorage } from '../../utils/StorageUtils';

const FoundBikesList = (
  {
    bikeMake,
    bikeModel,
    bikeYear
  }: {
    bikeMake: string;
    bikeModel: string;
    bikeYear: number | null;
  }
) => {

  const [bikesList, setBikesList] = useState<IBikeData[]>([]);

  const {
    state: [, updateGeometryContextState],
    metadata: [, setMetadata],
  } = useGeometryContext();

  const auth = useAuthContext();

  const findBikes = () =>  {
    const axiosInstance = getAxiosInstance();
    axiosInstance.get('/api/bikes', {
      params: {
        ...(bikeMake.length > 0 && {make: bikeMake}),
        ...(bikeModel.length > 0 && {model: bikeModel}),
        ...(bikeYear && {year: bikeYear}),
      }
    }).then(resp => {
      const data = resp.data as [IBikeData];
      setBikesList(data);
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    findBikes();
  },
  [bikeMake, bikeModel, bikeYear]);

  const loadBike = (id: string | null) => {
    if (!id) {
      console.log('unable to load bike withut ID');
      return;
    }
    loadBikeFromStorage(id).then(data => {
      updateGeometryContextState(data.data as GeometryState);
      data.data = null;
      setMetadata(data);
    }).catch(err => {
      console.log(err);
    });
  }

  const removeBike = (id: string | null) => {
    if (!id) {
      console.log('unable to remove bike withut ID');
      return;
    }

    confirmAlert({
      title: 'Confirm bike deletion',
      message: 'Are you sure you want to delete this bike?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            removeBikeFromStorage(id).then(message => {
              findBikes();
            }).catch(err => {
              console.log(err);
            });
          }
        },
        {
          label: 'No',
          onClick: () => {return;}
        }
      ]
    });
  }

  const cloneBike = (id: string | null) => {
    if (!id) {
      console.log('unable to clone bike withut ID');
      return;
    }
    cloneBikeInStorage(id).then(resp => {
      findBikes();
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <table>
      <thead>
        <tr>
          <th> Make </th>
          <th> Model </th>
          <th> Year </th>
          <th> Is Yours </th>
          <th> Load </th>
          <th> Delete </th>
          <th> Create copy </th>
        </tr>
      </thead>
      <tbody>
      {bikesList.map((bike) => (
        <tr key={`tr${bike._id}`}>
          <td>{bike.make}</td>
          <td>{bike.model}</td>
          <td>{bike.year}</td>
          <td>{bike.user === auth.authState.user ? "yes" : "No"}</td>
          <td><button onClick={() => {loadBike(bike._id!)}}>Load</button></td>
          <td>{bike.user === auth.authState.user && <button onClick={() => {removeBike(bike._id!)}}>Delete</button>}</td>
          <td>{bike.user != auth.authState.user && <button onClick={() => {cloneBike(bike._id!)}}>Create Copy</button>}</td>
        </tr>
        //<li><p>{bike.make} {bike.model} {bike.year} {bike.user === auth.authState.user ? "[private Copy]" : ""}</p><button onClick={() => {loadBike(bike._id!)}}>Load</button></li>
      ))}
      </tbody>
    </table>
  );
};

export default FoundBikesList;
