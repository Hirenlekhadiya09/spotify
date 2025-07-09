const express = require("express")
const router = express.Router()
const {searchSong,createPlaylist, getPlaylist, deletePlaylist, editPlaylist, addSongToPlaylist, getPlaylistById} = require('../controller/spotifyController');
const authMiddleware = require("../middleware/auth");


router.get('/searchsong', authMiddleware,searchSong)
router.post('/createplaylist',authMiddleware, createPlaylist);
router.get('/getplaylist', authMiddleware,getPlaylist)
router.get('/getplaylist/:id', authMiddleware, getPlaylistById);
router.delete('/deleteplaylist/:id', authMiddleware, deletePlaylist);
router.put('/editplaylist/:id', authMiddleware, editPlaylist);
router.post('/playlists/:playlistId/songs', authMiddleware, addSongToPlaylist);


module.exports = router

