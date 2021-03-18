const { google } = require('googleapis');
const axios = require('axios');
const secret = require('../../../config/secret.json');
const UserService = require('../../Model/user-services');
const UserToken = require('./../../Model/user-tokens');
const UserWidgets = require('./../../Model/user-widgets');

const service_name = 'Google';
const callback_route = 'http://localhost:8080/google/callback';
const refresh_access_token_route = 'https://oauth2.googleapis.com/token';

const googleAuthClient = new google.auth.OAuth2(
  secret.Google.Service.clientId,
  secret.Google.Service.clientSecret,
  callback_route
);

const scopes = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/calendar',
];

//#region Tools

async function getUserGoogleToken(user_id) {
  try {
    let result = await UserToken.getUserTokenByUserIdAndService(user_id, service_name);

    if (!result) {
      return null;
    }

    const now = new Date();
    if (result.expires_at < now) {
      const res = await axios.post(refresh_access_token_route, {
        client_id: secret.Google.Service.clientId,
        client_secret: secret.Google.Service.clientSecret,
        grant_type: "refresh_token",
        refresh_token: result.refresh_token
      });

      const expires_at = new Date();
      expires_at.setSeconds(expires_at.getSeconds() +3600);
      await UserToken.updateUserToken(res.data.access_token, expires_at, user_id, service_name);
      result.access_token = res.data.access_token;
    }
    return { access_token: result.access_token, refresh_token: result.refresh_token };
  } catch (err) {
    throw err;
  }
}

const googleWidgets = [
  {
    name: "google_calendar",
  },
  {
    name: "google_recent_photos",
  },
  {
    name: "google_random_photo",
  },
];

//#endregion

//#region Response

function send500(res) {
  res.status(500).send('Internal server error');
}

function sendSuccessLoginGoogle(res) {
  res.send("Connexion à Google réussi. Vous pouvez fermer la page.")
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

//#endregion


//#region Controller

const login = async (req, res) => {
  const user_id = req.signedCookies.user_id;
  const login_url = googleAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: user_id,
  });

  res.json({
    url: login_url
  });
}

const callback = async (req, res) => {
  const user_id = req.query.state;
  const code = req.query.code;

  try {
    const { tokens } = await googleAuthClient.getToken(code);

    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + 3600);
    result = await UserToken.createUserToken({
      userId: user_id,
      service: service_name,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expires_at
    });
    await UserService.updateUserServices(true, service_name, user_id);
    sendSuccessLoginGoogle(res);
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

const logout = async (req, res) => {
  try {
    const user_id = req.signedCookies.user_id;
    const result = await UserService.getUserServices(user_id);
    if (result.google) {
      await UserService.updateUserServices(false, service_name, user_id);
      for (const widget of googleWidgets) {
        await UserWidgets.updateUserWidgets(false, widget.name, user_id);
      }
      await UserToken.deleteUserTokenByIdAndService(service_name, user_id);
      sendSuccess(res);
    } else {
      sendNotLogged(res);
    }
  } catch (err) {
    console.error(err);
    send500(res);
  }
}

//#endregion

module.exports = {
  login,
  callback,
  getUserGoogleToken,
  logout
}
