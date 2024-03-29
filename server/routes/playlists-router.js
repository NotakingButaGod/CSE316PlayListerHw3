/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

router.post('/playlist', PlaylistController.createPlaylist)
router.delete('/playlist/:id', PlaylistController.deletePlaylist)
router.put('/playlist/:id', PlaylistController.updatePlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getAllPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)

module.exports = router