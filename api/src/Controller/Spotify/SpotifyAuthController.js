const SpotifyWebApi = require('spotify-web-api-node');
const secret = require('../../../config/secret.json');
const UserService = require('../../Model/user-services');
const UserToken = require('./../../Model/user-tokens');
const UserWidgets = require('../../Model/user-widgets');

//#region Tools

const service_name = 'Spotify';

const scopes = [
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
];

const spotifyApi = new SpotifyWebApi({
  clientId: secret.Spotify.clientId,
  clientSecret: secret.Spotify.clientSecret,
  redirectUri: 'http://localhost:8080/spotify/callback'
});

async function getUserSpotifyClient(user_id) {
  try {
    const result = await UserToken.getUserTokenByUserIdAndService(user_id, service_name);
    if (result) {
      let error = null;
      const now = new Date();
      spotifyApi.setAccessToken(result.access_token);
      spotifyApi.setRefreshToken(result.refresh_token);
      if (result.expires_at < now) {
        await spotifyApi.refreshAccessToken().then(
          async (data) => {
            const expires_at = new Date();
            expires_at.setSeconds(expires_at.getSeconds() + data.body['expires_in']);
            await UserToken.updateUserToken(data.body['access_token'], expires_at, user_id, service_name);
            spotifyApi.setAccessToken(data.body['access_token']);
          },
          (err) => {
            console.error('Could not refresh access token', err);
            error = err;
          }
        );
        if (error) {
          throw error;
        } else {
          return spotifyApi;
        }
      } else {
        return spotifyApi;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const spotifyWidgets = [
  {
    name: "spotify_player",
  },
  {
    name: "spotify_playlist",
  },
  {
    name: "spotify_favorite",
  },
];

//#endregion

//#region Response

function sendSuccessLoginSpotify(res) {
  res.send("Connexion à Spotify réussi, vous pouvez fermer la fenêtre");
}

function sendSuccess(res) {
  res.json({
    message: "Success"
  });
}

function sendNotLogged(res) {
  res.status(404).json({
    message: "Not Logged"
  });
}

function send500(res) {
  res.status(500).send('Internal server error');
}

//#endregion

//#region Controller

const login = (req, res) => {
  const user_id = req.signedCookies.user_id;
  const login_url = spotifyApi.createAuthorizeURL(scopes, user_id);
  res.json({
    url: login_url
  });
};

const callback = async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const user_id = req.query.state;

  if (error) {
      console.error('Callback Error:', error);
      send500(res);
      return;
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);

    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + data.body['expires_in']);
    result = await UserToken.createUserToken({
      userId: user_id,
      service: service_name,
      access_token: data.body['access_token'],
      refresh_token: data.body['refresh_token'],
      expires_at: expires_at
    });
    await UserService.updateUserServices(true, service_name, user_id);
    sendSuccessLoginSpotify(res);
  } catch (error) {
    console.error('Error getting Tokens:', error);
    send500(res);
  }
}

const logout = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const result = await UserService.getUserServices(user_id);
    if (result.spotify) {
      await UserService.updateUserServices(false, service_name, user_id);
      for (const widget of spotifyWidgets) {
        await UserWidgets.updateUserWidgets(false, widget.name, user_id);
      }
      await UserToken.deleteUserTokenByIdAndService(service_name, user_id);
      sendSuccess(res);
    } else {
      sendNotLogged(res);
    }
  } catch (err) {
    console.error(err);
    send500(ress);
  }
}

//#endregion

//#region exports

module.exports = {
  login,
  logout,
  callback,
  getUserSpotifyClient
}

//#endregion
