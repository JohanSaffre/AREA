const SpotifyWebApi = require('spotify-web-api-node');
const { getUserSpotifyClient } = require('./SpotifyAuthController');

//#region Tools

//#endregion

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendPlaylists(res, playlists) {
  res.json({
    playlists: playlists.body.items
  });
}

function sendUserNotFound(res) {
  res.status(404).send("User not found on Spotify users");
}

//#endregion

//#region Controller

const getPlaylists = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      data = await spotifyApi.getMe();
      playlists = await spotifyApi.getUserPlaylists(data.body.id, {
        limit: 5
      });
      sendPlaylists(res, playlists);
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

const playPlaylist = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      musics = await spotifyApi.getPlaylistTracks(req.params.id_playlist, {
        limit: 10,
        fields: 'items'
      });
      for (const item of musics.body.items) {
        await spotifyApi.addToQueue(item.track.uri);
      }
      await spotifyApi.skipToNext();
      res.json({items: musics.body.items});
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion


module.exports = {
  getPlaylists,
  playPlaylist,
}
