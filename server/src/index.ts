import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";
import { ClientServer } from "./modules/ClientServer";
import { ApiRegistry } from "./modules/ApiRegistry";

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

console.log(`starting server in ${__dirname}`)
// app.use(express.static(path.join(__dirname, "../../client/build")));

app.use(express.json({limit: '5mb'}));
// app.use(express.bodyParser({limit: '50mb'}));

const clientServer = new ClientServer(app);
const apiRegistry = new ApiRegistry(app);

clientServer.setup();
apiRegistry.setup();

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
})
