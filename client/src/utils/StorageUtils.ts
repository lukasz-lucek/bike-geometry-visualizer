import axios, { Axios, AxiosResponse } from "axios";
import GeometryStateSerializationHelper, { GeompetryPayloadSerializer } from "../contexts/GeometryStatesSerilizer"
import { IBikeData } from "../IGeometryState";
import { getAxiosInstance } from "./AxiosUtils";

export const saveBikeToStorage = (data: IBikeData) : Promise<string> => {
  return new Promise((resolve, reject) => {
    const serializer = new GeompetryPayloadSerializer(data)
    const prepPayload = serializer.serialize();

    const axiosInstance = getAxiosInstance();
    axiosInstance.put('api/bike', prepPayload, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json',
      },
      params: {
        id: data._id,
      }
    }).then(resp => {
      resolve(resp.data)
      console.log(resp);
    }).catch(function (error) {
      console.log(error);
    });
  });
    
}

export const loadBikeFromStorage = (id: string) : Promise<IBikeData> => {
  return new Promise<IBikeData>((resolve, reject) => {
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
      resolve(data);
    }).catch(err => {
      console.log(err);
      reject(err);
    });
  })
}

export const removeBikeFromStorage = (id: string) : Promise<string> => {
  return new Promise((resolve, reject) => {
    const axiosInstance = getAxiosInstance();
    axiosInstance.delete('/api/bike', {
      params: {
        id: id,
      }
    }).then(resp => {
      resolve(resp.data);
    }).catch(err => {
      console.log(err);
      reject(err);
    });
  })
}

export const cloneBikeInStorage = (id: string) : Promise<string> => {
  return new Promise((resolve, reject) => {
    const axiosInstance = getAxiosInstance();
    axiosInstance.get('/api/bike/copy', {
      params: {
        id: id,
      }
    }).then(resp => {
      resolve(resp.data);
    }).catch(err => {
      console.log(err);
      reject(err);
    });
  })
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