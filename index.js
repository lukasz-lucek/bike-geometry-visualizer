require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/books');
const path = require('path');


const app = express();

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`)
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

var environment = process.env.NODE_ENV || 'development';

var whitelist =  environment === 'development' ? ['http://localhost:3000'] : []

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    console.log("whitelisted domain");
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));

app.use(express.static(path.join(__dirname, "./client/build")));
// app.get('*', (_, res) => {
//   res.sendFile(
//     path.join(__dirname, "./client/build/index.html"),
//     (err) => {
//       res.status(500).send(err);
//     }
//   );
// });

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
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
    console.log("err: ", + error);
  }
});

app.get('/books', async (req, res) => {
  console.log("fetching books from DB");
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
