
import React, { useEffect, useState } from 'react';
import { getAxiosInstance, pareseBikeResponse } from '../../utils/AxiosUtils';
import { IBikeData } from '../../IGeometryState';
import { GeometryState, useGeometryContext } from '../../contexts/GeometryContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
    state: [geometryContextState, updateGeometryContextState],
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
    const axiosInstance = getAxiosInstance();
    axiosInstance.get('/api/bike', {
      params: {
        id: id,
        withImage: true,
      },
      transformResponse: [
        (data) => {
          try {
            return pareseBikeResponse(data);
          } catch (error) {
            throw Error(`[requestClient] Error parsing response JSON data - ${JSON.stringify(error)}`)
          }
        }
      ]
    }).then(resp => {
      const data = resp.data as IBikeData;
      updateGeometryContextState(data.data as GeometryState);
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
            const axiosInstance = getAxiosInstance();
            axiosInstance.delete('/api/bike', {
              params: {
                id: id,
              }
            }).then(resp => {
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
        </tr>
        //<li><p>{bike.make} {bike.model} {bike.year} {bike.user === auth.authState.user ? "[private Copy]" : ""}</p><button onClick={() => {loadBike(bike._id!)}}>Load</button></li>
      ))}
      </tbody>
    </table>
  );
};

export default FoundBikesList;
