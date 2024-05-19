import {Express} from 'express';
import passport from 'passport';
import { IUser } from '../models/Users';
import { GoogleDriveHelper } from './GoogleDriveHelper';
const { google } = require('googleapis');


export class GoogleDriveApiWrapper {
  private app: Express;
  private driveHelper: GoogleDriveHelper;

  constructor(app : Express) {
    this.app = app;
    this.driveHelper = GoogleDriveHelper.getInstance();
  }

  public setup() {
    this.app.get('/api/auth/google', passport.authenticate('jwt', {session: false}), async (req, res) => {
      // TODO - fix below checking if user is admin - should be done by passport somehow
      const user : IUser = (req.user as IUser);
      if (!user.isAdmin) {
        console.error(`non admin user ${user.username} accessing ${req.url}`);
        res.sendStatus(403)
        return;
      }
      const authUrl = this.driveHelper.generateAuthUrl();
      console.log(`auth URL: ${authUrl}`);

      res.send(authUrl);
    });

    this.app.get('/api/auth/google/callback', passport.authenticate('jwt', {session: false}), async (req, res) => {
      const user : IUser = (req.user as IUser);
      if (!user.isAdmin) {
        console.error(`non admin user ${user.username} accessing ${req.url}`);
        res.sendStatus(403)
        return;
      }

      const code = req.query.code;
      // const code = decodeURIComponent(req.query.code as string);
      console.log(`code from google: ${code}`);
    
      try {
        await this.driveHelper.exchangeCodeForTokens(code as string);
    
        // Redirect the user to a success page or perform other actions
        res.send('Authentication successful!');
      } catch (error) {
        console.error('Error authenticating:', error);
        res.status(500).send('Authentication failed.');
      }
    });
  }
};