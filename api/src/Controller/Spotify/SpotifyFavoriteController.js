const { getUserSpotifyClient } = require('./SpotifyAuthController');

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendUserNotFound(res) {
  res.status(404).send("User not found on Spotify users");
}

function sendBadRequest(res) {
  res.status(400).json({
    message: "Mauvaise requête"
  });
}

function sendFavorites(res, data) {
  res.json({
    items: data.body.items
  })
}

const getFavorites = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const spotifyApi = await getUserSpotifyClient(user_id);
    if (spotifyApi) {
      switch (req.params.type) {
        case "tracks":
          data = await spotifyApi.getMyTopTracks({
            limit: 5,
          });
          break;
        case "artists":
          data = await spotifyApi.getMyTopArtists({
            limit: 5
          });
          break;
        default:
          break;
      }
      if (data) {
        sendFavorites(res, data);
      } else {
        sendBadRequest(res);
      }
    } else {
      sendUserNotFound(res);
    }
  } catch (err) {
    console.error(err);
    send500(ress);
  }
}

module.exports = {
  getFavorites
}
