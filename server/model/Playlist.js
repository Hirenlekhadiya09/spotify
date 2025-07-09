const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  spotifyId: String,
  title: String,
  artist: String,
  album: String,
  image: String,
  preview_url: String,
});

const playlistSchema = new mongoose.Schema({
  userId: String,
  name: String,
  description: String,
  songs: [songSchema]
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
