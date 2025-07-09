const { default: axios } = require("axios");
const { getSpotifyToken } = require("../utills/apifunction");
const Playlist = require('../model/Playlist')


const searchSong = async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        const token = await getSpotifyToken();
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: { q: query, type: 'track', limit: 10 },
            headers: { Authorization: `Bearer ${token}` }
        });

        const songs = response.data.tracks.items.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            image: track.album.images[0]?.url,
            preview_url: track.preview_url
        }));
        res.json(songs);

    } catch (error) {
        console.error(" error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newPlaylist = new Playlist({
      userId: req.user.id,
      name,
      description,
      songs: [],
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const song = req.body;

    const playlist = await Playlist.findOne({ _id: playlistId, userId: req.user.id });
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    playlist.songs.push(song);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getPlaylist = async (req, res) => {
  try {
    const response = await Playlist.find()
    console.log("response",response)
    return res.status(201).json(response)
  } catch (error) { 
    console.error("Error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deletePlaylist = async(req,res) => {
    try {
        const { id } = req.params;
        const response = await Playlist.findByIdAndDelete(id)
         if (!response) {
            return res.status(404).json({ message: 'palylist not found' });
        }
       return res.status(200).json({ message: 'playlist deleted successfully', user: response });
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const editPlaylist = async(req,res) => {
    try {
        const { id } = req.params;
        const response = await Playlist.findByIdAndUpdate(id,req.body,{
             new: true, 
        })
        console.log("response", response)
         if (!response) {
            return res.status(404).json({ message: 'palylist not found' });
        }
       return res.status(200).json({ message: 'playlist edit successfully', user: response });
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = {
    searchSong,
    createPlaylist,
    addSongToPlaylist,
    getPlaylist,
    getPlaylistById,
    deletePlaylist,
    editPlaylist
}