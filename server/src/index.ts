import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";
import path from 'path'
import Book from './models/books';

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

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, "client/build/index.html"),
    (err) => {
      res.status(500).send(err);
    }
  );
});

app.get('/add-note', async (req, res) => {
  try {
    await Book.insertMany([
      {
        title: "Hichhikers guide",
        body: "Lorem Ipsum"
      },
      {
        title: "Dumb tutorial",
        body: "Lorem Ipsum ..."
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

app.get('/books', async (req, res) => {
  console.log("fetching books from Database");
  const books = await Book.find();
  if (books) {
    res.json(books);
  } else {
    res.send("No books for you my frined");
  }
});

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
})
