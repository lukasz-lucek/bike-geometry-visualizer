import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";
import path from 'path'
import GeometryState from './models/GeometryState';

dotenv.config();


const app = express();

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI environment variable not specified - cannot run - exiting")
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`)
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

const environment = process.env.NODE_ENV || 'development';

const whitelist =  environment === 'development' ? ['http://localhost:3000'] : []

const corsOptionsDelegate = (req : any, callback : any) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    console.log("whitelisted domain");
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));

app.use(express.static(path.join(__dirname, "client/build")));

app.use(express.json({limit: '5mb'}));
// app.use(express.bodyParser({limit: '50mb'}));

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, "client/build/index.html"),
    (err) => {
      res.status(500).send(err);
    }
  );
});

app.post('/send-upstream', async (req, res) => {

  console.log(`received request to store bike: ${JSON.stringify(req.body.data).substring(0, 500)}`);

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

app.get('/add-bike', async (req, res) => {
  try {
    await GeometryState.insertMany([
      {
        wheelbase: 1029,
        selectedFile: null,
        bikesList: ["Aspre 2", "Other bike"],
        shifterMountOffset: 0.5,
        seatRailAngle: 5,
        geometryPoints: {
          rearWheelCenter: {
            x: 1,
            y: 234,
            color: {
              color: [123, 154, 233],
              model: 'rgb',
              valpha: 1
            }
          },
          frontWheelCenter: {
            x: 2,
            y: 4,
            color: {
              color: [13, 14, 23],
              model: 'rgb',
              valpha: 1
            }
          }
        }
      }
    ]);
    res.send("Data added...");
  } catch (error) {
    if (error instanceof Error) {
      console.log("add-note err: ", + error.message);
    } else {
      console.log("add-note err: Unknown " + typeof(error));
    }
  }
});

app.get('/bikes', async (req, res) => {
  console.log("fetching books from Database");
  const bikes = await GeometryState.find();
  if (bikes) {
    res.json(bikes);
  } else {
    res.send("No bikes for you my frined");
  }
});

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
})