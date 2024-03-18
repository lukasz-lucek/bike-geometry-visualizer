import {Express} from 'express';
import GeometryState from '../models/GeometryState';
import passport from 'passport';


export class BikeApi {
  private app: Express;
  constructor(app : Express) {
    this.app = app;
  }

  public setup() {
    this.app.post('/api/send-upstream', passport.authenticate('jwt', {session: false}), async (req, res) => {
      req.body.data.selectedFile = ''
      try {
        await GeometryState.create(req.body.data);
        res.status(200).send("bike added");
      } catch (error) {
        if (error instanceof Error) {
          console.log("add-note err: ", + error.message);
        } else {
          console.log("add-note err: Unknown " + typeof(error));
        }
      }
    });

    this.app.get('/api/bikes', passport.authenticate('jwt', {session: false}), async (req, res) => {
      const bikes = await GeometryState.find();
      if (bikes) {
        res.json(bikes);
      } else {
        res.send("No bikes for you my frined");
      }
    });
  }
};