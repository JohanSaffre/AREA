const { Router } = require('express');
const { login, callback, logout } = require('../Controller/Spotify/SpotifyAuthController');
const { play, pause, next, prev, current, isPlaying } = require('./../Controller/Spotify/SpotifyPlayerController');
const { getPlaylists, playPlaylist } = require('./../Controller/Spotify/SpotifyPlaylistController');
const { getFavorites } = require('./../Controller/Spotify/SpotifyFavoriteController');
const spotifyRouter = Router();

// Login / Logout routes
spotifyRouter.get('/login', login);
spotifyRouter.get('/logout', logout);
spotifyRouter.get('/callback', callback);

// Player Routes
spotifyRouter.get('/play', play);
spotifyRouter.get('/pause', pause);
spotifyRouter.get('/next', next);
spotifyRouter.get('/prev', prev);
spotifyRouter.get('/current', current);
spotifyRouter.get('/playing', isPlaying);

// Playlist Routes
spotifyRouter.get('/playlists', getPlaylists);
spotifyRouter.get('/playlists/play/:id_playlist', playPlaylist);

// Favorite
spotifyRouter.get('/favorites/:type', getFavorites);

module.exports = spotifyRouter;
