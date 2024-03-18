import {Express} from 'express';
import { BikeApi } from './BikeApi';
import { AuthorizationApi } from './AuthorizationApi';

export class ApiRegistry {
  private app: Express;
  private authorizationApi: AuthorizationApi;
  private bikeApi: BikeApi;
  constructor(app : Express) {
    this.app = app;
    this.authorizationApi = new AuthorizationApi(this.app);
    this.bikeApi = new BikeApi(this.app);
  }

  public setup() {
    this.authorizationApi.setup();
    this.bikeApi.setup(); 
  }
};