import {Express} from 'express';
import { BikeApi } from './BikeApi';
import { AuthorizationApi } from './AuthorizationApi';
import { GoogleDriveApiWrapper } from './GoogleDriveApiWrapper';

export class ApiRegistry {
  private app: Express;
  private authorizationApi: AuthorizationApi;
  private bikeApi: BikeApi;
  private googleDriveApiWrapper: GoogleDriveApiWrapper;
  constructor(app : Express) {
    this.app = app;
    this.authorizationApi = new AuthorizationApi(this.app);
    this.bikeApi = new BikeApi(this.app);
    this.googleDriveApiWrapper = new GoogleDriveApiWrapper(this.app);
  }

  public setup() {
    this.authorizationApi.setup();
    this.bikeApi.setup(); 
    this.googleDriveApiWrapper.setup();
  }
};