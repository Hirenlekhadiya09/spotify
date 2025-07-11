const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const login = require('./routes/userRoute');
const spotify = require('./routes/spotifyRoute');

const app = express();

const allowedOrigins = ['https://spotify-frontend-tutg.onrender.com'];



var corsOptions = {
  origin: ['https://spotify-zov4.onrender.com','http://localhost:3000','http://localhost:80'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}


app.use(cors(corsOptions));

// app.options('*', cors());

connectDB();
app.use(express.json());

app.use("/api", login);
app.use("/api", spotify);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'
app.listen(PORT,HOST, () => {
  console.log(`Server is running on ${PORT}`);
});
