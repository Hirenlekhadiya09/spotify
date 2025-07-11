const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const login = require('./routes/userRoute');
const spotify = require('./routes/spotifyRoute');

const app = express();

const allowedOrigins = ['https://spotify-frontend-tutg.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

connectDB();
app.use(express.json());

app.use("/api", login);
app.use("/api", spotify);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
