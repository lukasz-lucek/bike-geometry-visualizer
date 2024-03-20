import {Express} from 'express';
import GeometryState from '../models/GeometryState';
import passport from 'passport';
import { S3 } from '@aws-sdk/client-s3';
import { IGeometryState } from '../IGeometryState';


export class BikeApi {
  private app: Express;
  private s3: S3;
  private bucketName: string;
  constructor(app : Express) {
    this.app = app;
    this.s3 = new S3();
    if (! process.env.CYCLIC_BUCKET_NAME) {
      console.log('S3 Bucket name missing in .env file - exiting');
      process.exit(1);
    }
    this.bucketName = process.env.CYCLIC_BUCKET_NAME
  }

  public setup() {
    this.app.post('/api/send-upstream', passport.authenticate('jwt', {session: false}), async (req, res) => {
      const bikeData : IGeometryState = req.body.data;
      if (!bikeData.selectedFileHash || !bikeData.selectedFile) {
        return res.status(400).send('bike immage or image hash is missing');
      }
      const filePath = `images/${bikeData.selectedFileHash}`;
      let fileAlreadyUploadedToS3 = false;
      try {
        console.log(`checking existance of file ${filePath} in S3`)
        await this.s3.headObject({
          Bucket: this.bucketName,
          Key: filePath,
        });
        fileAlreadyUploadedToS3 = true;
        console.log('file already added to S3')
      } catch (error : any) {
        //const error : Error = errorr as Error;
        if (error && error.name === "NotFound") {
          fileAlreadyUploadedToS3 = false;
          console.log('file not found in S3')
        } else {
          const message = `unable to contact S3: ${JSON.stringify(error)}`;
          console.log(message);
          return res.status(500).send(message);
        }
      }

      if (!fileAlreadyUploadedToS3) {
        try {
          console.log("uploading file to S3")
          await this.s3.putObject({
            Body: bikeData.selectedFile,
            Bucket: this.bucketName,
            Key: filePath,
          });
          console.log("file uploaded to S3");
        } catch (error: any) {
          const message = `unable to upload image to S3: ${error.message}`;
          console.log(message);
          return res.status(500).send(message);
        }
      }

      console.log('adding geometry to database');
      bikeData.selectedFile = ''
      try {
        await GeometryState.create(bikeData);
        res.status(200).send("bike added");
      } catch (error) {
        if (error instanceof Error) {
          const message = `"send-upstream err: ${error.message}`;
          console.log(message);
          return res.status(500).send(message);
        } else {
          const message = `"send-upstream err: ${typeof(error)}`;
          console.log(message);
          return res.status(500).send(message);
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