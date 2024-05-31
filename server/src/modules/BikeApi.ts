import {Express, response} from 'express';
import { query, validationResult } from 'express-validator';
import BikeData from '../models/GeometryState';
import passport from 'passport';
import { S3 } from '@aws-sdk/client-s3';
import { IBikeData, IGeometryState } from '../IGeometryState';
import { IUser } from '../models/Users';
import { GoogleDriveHelper } from './GoogleDriveHelper';


export class BikeApi {
  private app: Express;
  //private s3: S3;
  private bucketName: string;
  constructor(app : Express) {
    this.app = app;
    //this.s3 = new S3();
    if (! process.env.CYCLIC_BUCKET_NAME) {
      console.log('S3 Bucket name missing in .env file - exiting');
      process.exit(1);
    }
    this.bucketName = process.env.CYCLIC_BUCKET_NAME
  }

  private createBikeQuery(query: Object | null, reqUser: Express.User) {
    const user: IUser = reqUser as IUser;
    return {$or: [{...query, user: user.username}, {...query, isPublic: true}]};
  }

  private combineQueriesAnd(queryOne: Object | null, queryTwo : Object | null) {
    if (queryOne && queryTwo) {
      return {$and: [queryOne, queryTwo]}
    } else if (queryOne) {
      return queryOne;
    } else if (queryTwo) {
      return queryTwo
    }
    return {};
  }

  public setup() {
    
    // driveHelper.listFiles();
    this.app.post('/api/send-upstream', passport.authenticate('jwt', {session: false}), async (req, res) => {
      const bikeData : IBikeData = req.body;
      if (!req.user) {
        console.log('unkonwn user - probably something fishy is going on - passport should have handled that');
        return res.status(403).send('Unknown user');
      }
      const user : IUser = (req.user as IUser);
      bikeData.user = user.username;
      if (!user.isAdmin) {
        bikeData.isPublic = false;
      }
      if (!bikeData.data.selectedFileHash || !bikeData.data.selectedFile) {
        console.log('bad data - no immage attached to request')
        return res.status(400).send('bike immage or image hash is missing');
      }
      const filePath = `${bikeData.data.selectedFileHash}`;

      const driveHelper = GoogleDriveHelper.getInstance();
      const fileId =  await driveHelper.getFileId(filePath);
      if (!fileId) {
        await driveHelper.putFile(bikeData.data.selectedFile, filePath);
      }

      console.log('adding geometry to database');
      bikeData.data.selectedFile = ''
      try {
        await BikeData.create(bikeData);
        console.log('geometry added to database');
        res.status(200).send("bike added");
      } catch (error) {
        if (error instanceof Error) {
          const message = `send-upstream err: ${error.message}`;
          console.log(message);
          return res.status(500).send(message);
        } else {
          const message = `send-upstream err: ${typeof(error)}`;
          console.log(message);
          return res.status(500).send(message);
        }
      }
    });

    this.app.get('/api/makes', passport.authenticate('jwt', {session: false}), async (req, res) =>
    {
      BikeData.collection.distinct('make', this.createBikeQuery(null, req.user!)).then((values) => {
        res.json(values);
      }).catch((err) => {
        res.status(500).send(`unable to fetch makes: ${err}`);
      });
    });

    this.app.get('/api/models', passport.authenticate('jwt', {session: false}),
      query('make').escape().isLength({min: 0, max: 50}),
    async (req, res) =>
    {
      if (!req.query || !req.query.make) {
        res.status(400).send("you must provide make of the bike");
        return;
      }
      const findQuery = {
        make : req.query.make
      }
      BikeData.collection.distinct('model', this.createBikeQuery(findQuery, req.user!)).then((values) => {
        res.json(values);
      }).catch((err) => {
        res.status(500).send(`unable to fetch makes: ${err}`);
      });
    });

    this.app.get('/api/years', passport.authenticate('jwt', {session: false}),
      query('make').escape().isLength({min: 0, max: 50}),
      query('model').escape().isLength({min: 0, max: 50}),
    async (req, res) =>
    {
      if (!req.query || !req.query.make || !req.query.model) {
        res.status(400).send("you must provide make and model of the bike");
        return;
      }
      const user : IUser = (req.user as IUser);
      console.log("user forming request: "+user.username);
      const findQuery = {
        make : req.query.make,
        model: req.query.model
      }
      BikeData.collection.distinct('year', this.createBikeQuery(findQuery, req.user!)).then((values) => {
        res.json(values);
      }).catch((err) => {
        res.status(500).send(`unable to fetch years: ${err}`);
      });
    });

    this.app.get('/api/bikes', passport.authenticate('jwt', {session: false}), 
                  query('model').escape().isLength({min: 0, max: 50}), 
                  query('make').escape().isLength({min: 0, max: 50}), 
                  query('year').escape().isNumeric(),
                  query('search').escape().isString().isLength({min: 1, max: 50}),
    async (req, res) =>
    {
      const searchQuery = req.query?.search? {$text: { $search: req.query?.search }} : null;
      const findQuery = this.createBikeQuery({
        ...(req.query?.model && {model: req.query.model}),
        ...(req.query?.make && {make: req.query.make}),
        ...(req.query?.year && {year: req.query.year}),
      }, req.user!);

      const combinedQuery = this.combineQueriesAnd(searchQuery, findQuery);
      //const finalQuerry = combinedQuery, req.user!);
      console.log(combinedQuery);

      const bikes = await BikeData.find(combinedQuery).select(
        {
          make: 1,
          model: 1,
          year: 1,
          user: 1,
          isPublic: 1,
        }
      );
      if (bikes) {
        res.json(bikes);
      } else {
        res.send("No bikes for you my frined");
      }
    });

    this.app.get('/api/bike', passport.authenticate('jwt', {session: false}),
    query('id').escape().isLength({min: 0, max: 50}),
    async (req, res) => {
      if (!req.query || !req.query.id) {
        res.status(400).send("no id was provided");
        return;
      }
      BikeData.findById(req.query.id).then(bike => {
        res.json(bike);
      }).catch(err => {
        res.status(404).send("bike not found");
      })
    });

    this.app.get('/api/bikeImage', passport.authenticate('jwt', {session: false}),
    query('id').escape().isLength({min: 0, max: 50}),
    async (req, res) => {
      if (!req.query || !req.query.id) {
        res.status(400).send("no id was provided");
        return;
      }
      BikeData.findById(req.query.id).select({"data.selectedFileHash" : 1}).then(bike => {
        if (!bike) {
          res.status(404).send("bike not found");
          return;
        }
        const filePath = `${bike.data.selectedFileHash}`;

        const driveHelper = GoogleDriveHelper.getInstance();
        driveHelper.getFileId(filePath).then(fileId => {
          if (!fileId) {
            res.status(404).send("bike image not found");
            return;
          }
          driveHelper.getFileFromDrive(fileId).then( file => {
            res.send(file);
          }).catch(err => {
            res.status(404).send("bike image not readable");
          })
        }).catch(err => {
          res.status(404).send("bike not found");
        });
      }).catch(err => {
        res.status(404).send("bike not found");
      });
    });

    this.app.get('/api/bikeFull', passport.authenticate('jwt', {session: false}),
    query('id').escape().isLength({min: 0, max: 50}),
    async (req, res) => {
      if (!req.query || !req.query.id) {
        res.status(400).send("no id was provided");
        return;
      }
      BikeData.findById(req.query.id).then(bike => {
        if (!bike) {
          res.status(404).send("bike not found");
          return;
        }
        const filePath = `${bike.data.selectedFileHash}`;

        const driveHelper = GoogleDriveHelper.getInstance();
        driveHelper.getFileId(filePath).then(fileId => {
          if (!fileId) {
            res.status(404).send("bike image not found");
            return;
          }
          driveHelper.getFileFromDrive(fileId).then( file => {
            bike.data.selectedFile = file;
            res.json(bike);
          }).catch(err => {
            res.status(404).send("bike image not readable");
          })
        }).catch(err => {
          res.status(404).send("bike not found");
        });
      }).catch(err => {
        res.status(404).send("bike not found");
      });
    });
  }
};