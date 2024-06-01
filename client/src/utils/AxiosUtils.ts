import axios, { Axios, AxiosResponse } from "axios";
import GeometryStateSerializationHelper from "../contexts/GeometryStatesSerilizer"
import { IBikeData } from "../IGeometryState";

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

class BikreResponseParser extends GeometryStateSerializationHelper {
  response: IBikeData | null;

  constructor() {
    super();
    this.response = null;
  }

  deserialize(serializedData: string) {
    this.response = JSON.parse(serializedData, this.reviver);
  }
}

export const pareseBikeResponse = (data: string) : IBikeData => {
  const parser = new BikreResponseParser();
  parser.deserialize(data);
  console.log(parser.response);
  return parser.response!;
}