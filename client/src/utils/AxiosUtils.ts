import axios, { Axios, AxiosResponse } from "axios";

export const getAxiosInstance = () : Axios => {
  const address = process.env.REACT_APP_SERVER_ADDRESS || '';
  const token = localStorage.getItem('jwt');
  const instance = axios.create({
    baseURL: address,
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  return instance;
}

export const getUnauthorizedAxiosInstance = () : Axios => {
  const address = process.env.REACT_APP_SERVER_ADDRESS || '';
  const instance = axios.create({
    baseURL: address,
  });
  return instance;
}
