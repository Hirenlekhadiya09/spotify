const express = require('express')
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db')
const login = require('./routes/userRoute')
const spotify = require('./routes/spotifyRoute')


const app = express()

app.use(cors({
  origin: 'https://your-frontend.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

connectDB()
app.use(express.json());

app.use("/api", login)
app.use("/api", spotify)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})