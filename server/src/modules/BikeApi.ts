import {Express, response} from 'express';
import { query, validationResult } from 'express-validator';
import BikeData from '../models/GeometryState';
import passport from 'passport';
import { IBikeData, IGeometryState } from '../IGeometryState';
import { IUser } from '../models/Users';
import { GoogleDriveHelper } from './GoogleDriveHelper';
import mongoose from 'mongoose';


export class BikeApi {
  private app: Express;
  constructor(app : Express) {
    this.app = app;
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
    this.app.post('/api/bike', passport.authenticate('jwt', {session: false}), async (req, res) => {
      const bikeData : IBikeData = req.body;
      // prevent blockade of overwriting id by mongoose
      delete bikeData._id;

      if (!req.user) {
        console.log('unkonwn user - probably something fishy is going on - passport should have handled that');
        return res.status(403).send('Unknown user');
      }
      if (!(bikeData.data)) {
        return res.status(400).send('Bad request - empty data of geometry');
      }
      const user : IUser = (req.user as IUser);
      bikeData.user = user.username;
      if (!user.isAdmin) {
        bikeData.isPublic = false;
      }
      if (!bikeData.data.selectedFileHash) {
        console.log('bad data - no immage hash attached to request')
        return res.status(400).send('bike image hash is missing');
      }
      const filePath = `${bikeData.data.selectedFileHash}`;

      const driveHelper = GoogleDriveHelper.getInstance();
      const fileId =  await driveHelper.getFileId(filePath);
      if (!fileId) {
        if (!bikeData.data.selectedFile) {
          console.log('bad data - no immage attached to request, while hash is unkown')
          return res.status(400).send('bike image is missing, and was never uploaded');
        }
        await driveHelper.putFile(bikeData.data.selectedFile, filePath);
      }

      console.log('adding geometry to database');
      bikeData.data.selectedFile = ''
      try {
        await BikeData.create(bikeData).then(document => {
          console.log('geometry added to database' + document);
          res.status(201).location(`/api/bike?id=${document._id}&withImage=true`).send(document._id);
        });
      } catch (error) {
        if (error instanceof Error) {
          const message = `save bike err: ${error.message}`;
          console.log(message);
          return res.status(500).send(message);
        } else {
          const message = `save bike err: ${typeof(error)}`;
          console.log(message);
          return res.status(500).send(message);
        }
      }
    });

    this.app.put('/api/bike', passport.authenticate('jwt', {session: false}),
      query('id').escape().isLength({min: 0, max: 50}),
    async (req, res) => {
      const bikeData : IBikeData = req.body;

      if (req.query && req.query.id) {
        bikeData._id = req.query.id
      }

      if (!bikeData._id) {
        console.log('unknown data id - cannot update');
        return res.status(400).send('unknown data id - cannot update');
      }

      if (!(bikeData.data)) {
        console.log('unknown data - cannot update');
        return res.status(400).send('unknown data - cannot update');
      }

      if (!req.user) {
        console.log('unkonwn user - probably something fishy is going on - passport should have handled that');
        return res.status(403).send('Unknown user');
      }
      const user : IUser = (req.user as IUser);

      const storedBike = await BikeData.findOne({_id: bikeData._id}).select(
        {
          user: 1,
        }
      );

      if (!(storedBike?.user === user.username)) {
        return res.status(403).send('this is not your bike - cannot save changes - make a copy first');
      }

      bikeData.user = user.username;
      if (!user.isAdmin) {
        bikeData.isPublic = false;
      }
      if (!bikeData.data.selectedFileHash) {
        console.log('bad data - no immage hash attached to request')
        return res.status(400).send('bike image hash is missing');
      }
      const filePath = `${bikeData.data.selectedFileHash}`;

      const driveHelper = GoogleDriveHelper.getInstance();
      const fileId =  await driveHelper.getFileId(filePath);
      if (!fileId) {
        if (!bikeData.data.selectedFile) {
          console.log('bad data - no immage attached to request, while hash is unkown')
          return res.status(400).send('bike image is missing, and was never uploaded');
        }
        await driveHelper.putFile(bikeData.data.selectedFile, filePath);
      }

      console.log('updating geometry in database');
      bikeData.data.selectedFile = ''
      try {
        await BikeData.replaceOne({_id: bikeData._id}, bikeData).then(document => {
          console.log('geometry updated in database' + document);
          res.status(200).location(`/api/bike?id=${document.upsertedId}&withImage=true`).send(document.upsertedId);
        });
      } catch (error) {
        if (error instanceof Error) {
          const message = `save bike err: ${error.message}`;
          console.log(message);
          return res.status(500).send(message);
        } else {
          const message = `save bike err: ${typeof(error)}`;
          console.log(message);
          return res.status(500).send(message);
        }
      }
    });

    this.app.delete('/api/bike', passport.authenticate('jwt', {session: false}),
      query('id').escape().isLength({min: 0, max: 50}),
    async (req, res) => {
      if (!req.query || !req.query.id) {
        res.status(400).send('invalid query - need to provide id');
        return;
      }
      BikeData.deleteOne({_id: req.query.id}).then(result => {
        res.status(200).send("deleted");
      }).catch(err => {
        res.status(500).send("could not delete");
      });
    })

    this.app.get('/api/makes', passport.authenticate('jwt', {session: false}),
      query('search').escape().isLength({min: 0, max: 50}),
    async (req, res) =>
    {
      let findQuery = null;
      if (req.query && req.query.search){
        findQuery ={
          make : new RegExp(".*" + req.query.search + ".*")
        }
      }
      BikeData.collection.distinct('make', this.createBikeQuery(findQuery, req.user!)).then((values) => {
        res.json(values);
      }).catch((err) => {
        res.status(500).send(`unable to fetch makes: ${err}`);
      });
    });

    this.app.get('/api/models', passport.authenticate('jwt', {session: false}),
      query('make').escape().isLength({min: 0, max: 50}),
      query('search').escape().isLength({min: 0, max: 50}),
    async (req, res) =>
    {
      console.log('get models: '+ (req.query?.search? req.query.search : ''));
      let findQuery = null
      if (req.query && (req.query.search || req.query.make)){
        findQuery = {
          ...(req.query.make && {make : req.query.make}),
          ...(req.query.search && {model: new RegExp(".*" + req.query.search + ".*")})
        }
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
      let findQuery = null
      if (req.query && (req.query.search || req.query.make)){
        findQuery = {
          ...(req.query.make && {make : req.query.make}),
          ...(req.query.model && {model: req.query.model})
        }
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
        ...(req.query?.model && {model: new RegExp(".*" + req.query.model + ".*")}),
        ...(req.query?.make && {make: new RegExp(".*" + req.query.make + ".*")}),
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
    query('withImage').escape().isBoolean(),
    async (req, res) => {
      if (!req.query || !req.query.id) {
        res.status(400).send("no id was provided");
        return;
      }
      BikeData.findById(req.query.id).then(bike => {
        if (!bike || !(bike.data)) {
          return res.status(404).send("bike not found");
        }
        if (req.query!.withImage) {
          const filePath = `${bike.data.selectedFileHash}`;

          const driveHelper = GoogleDriveHelper.getInstance();
          driveHelper.getFileId(filePath).then(fileId => {
            if (!fileId) {
              res.status(404).send("bike image not found");
              return;
            }
            driveHelper.getFileFromDrive(fileId).then( file => {
              bike.data!.selectedFile = file;
              res.json(bike);
            }).catch(err => {
              res.status(404).send("bike image not readable");
            }).catch(err => {
              res.status(404).send("bike image not found");
            });
          })
        } else {
          res.json(bike);
        }
      }).catch(err => {
        res.status(404).send("bike not found");
      })
    });

    this.app.get('/api/bike/copy', passport.authenticate('jwt', {session: false}),
    query('id').escape().isLength({min: 0, max: 50}),
    async (req, res) => {
      if (!req.query || !req.query.id) {
        res.status(400).send("no id was provided");
        return;
      }
      BikeData.findById(req.query.id).then(async bike => {
        if (!bike || !(bike.data)) {
          return res.status(404).send("bike not found");
        }
        const user : IUser = (req.user as IUser);

        const storedBike = await BikeData.findOne(
          {
            make: bike.make,
            model: bike.model,
            year: bike.year,
            user: user.username
          }
        ).select({
          _id: 1,
        })

        if (storedBike) {
          return res.status(200).location(`/api/bike?id=${storedBike._id}&withImage=true`).send(storedBike._id);
        }

        const bikeData = bike;
        // prevent blockade of overwriting id by mongoose
        bikeData._id = new mongoose.Types.ObjectId().toString();
        bikeData.isNew = true;

        bikeData.user = user.username;
        if (!user.isAdmin) {
          bikeData.isPublic = false;
        }

        console.log('adding geometry to database');
        bikeData.data!.selectedFile = ''
        try {
          BikeData.create(bikeData).then(document => {
            console.log('geometry added to database' + document);
            res.status(201).location(`/api/bike?id=${document._id}&withImage=true`).send(document._id);
          });
        } catch (error) {
          if (error instanceof Error) {
            const message = `save bike err: ${error.message}`;
            console.log(message);
            return res.status(500).send(message);
          } else {
            const message = `save bike err: ${typeof(error)}`;
            console.log(message);
            return res.status(500).send(message);
          }
        }
      }).catch(err => {
        res.status(404).send("bike not found");
      });
    });

    this.app.get('/api/bikeImage', passport.authenticate('jwt', {session: false}),
    query('id').escape().isLength({min: 0, max: 50}),
    async (req, res) => {
      if (!req.query || !req.query.id) {
        res.status(400).send("no id was provided");
        return;
      }
      BikeData.findById(req.query.id).select({"data.selectedFileHash" : 1}).then(bike => {
        if (!bike || !(bike.data)) {
          return res.status(404).send("bike not found");
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
  }
};