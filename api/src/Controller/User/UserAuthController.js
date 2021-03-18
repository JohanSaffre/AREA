const User = require('../../Model/users')
const bcryp = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const secret = require('./../../../config/secret.json');
const googleClient = new OAuth2Client(secret.Google.Auth.clientId);
const UserServices = require('../../Model/user-services');
const UserWidgets = require('./../../Model/user-widgets');
const axios = require('axios');

//#region Tools

function validateUser(user) {
  if (!user.email || !user.password) {
    return false
  }
  const validEmail = typeof user.email == 'string'
                      && user.email.trim() != '';
  const validPassword = typeof user.password == 'string'
                      && user.password.trim() != ''
                      && user.password.length >= 6;

  return validEmail && validPassword;
}

function validateNewUser(user) {
  if (!user.username) {
    return false;
  }
  const validUsername = typeof user.username == 'string'
                        && user.username.trim() != '';

  return validUsername && validateUser(user);
}

async function getGooglePayload(token) {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audiance: secret.Google.Auth.clientId
  });
  return ticket.getPayload();
}

async function createUser(username, email, password) {
  try {
    const user = await User.createUser({
      username,
      email,
      password
    });
    await UserServices.createUserServices(user.id);
    await UserWidgets.createUserWidgets(user.id);
    return user;
  } catch (err) {
    throw  err;
  }
}


async function getFacebookApiAccessToken() {
  const fb_access_token_url = "https://graph.facebook.com/oauth/access_token?client_id="
  + secret.Facebook.clientId + "&client_secret=" + secret.Facebook.clientSecret +
  "&grant_type=client_credentials";

  const result = await axios.get(fb_access_token_url);
  return result.data.access_token;
}

function getFacebookCertifToken(access_token, token) {
  return 'https://graph.facebook.com/debug_token?input_token=' + token + '&access_token=' + access_token;
}

//#endregion

//#region response

function sendUserCookie(res, user) {
  res.cookie('user_id', user.id, {
    httpOnly: true,
    signed: true
  });
}

function sendLoginSuccess(res) {
  res.json({
    message: "Utilisateur connecté"
  });
}

function sendUserAlreadyExist(res) {
  res.status(409).json({
    message: "Email déjà utilisé"
  });
}

function sendBadRequest(res) {
  res.status(400).json({
    message: "Mauvais utilisateur"
  });
}

function sendWrongUser(res) {
  res.status(422).json({
    message: "Identifiant ou mot de passe incorrect"
  });
}

function sendUserLogout(res) {
  res.clearCookie('client_id');
  res.json({
    message: "Utilisateur déconnecté"
  });
}

function send500(res) {
  res.status(500).send("Internal Server Error");
}

//#endregion

//#region controller

const signup = async (req, res) => {
  if (validateNewUser(req.body)) {
    try {
      if (!await User.getUserByEmail(req.body.email)) {
        bcryp.hash(req.body.password, 10)
        .then( async (hash) => {
          const user = await createUser(
            req.body.username,
            req.body.email,
            hash
          );
          sendUserCookie(res, user);
          sendLoginSuccess(res);
        });
      } else {
        sendUserAlreadyExist(res);
      }
    } catch (error) {
      console.error(error);
      send500(res);
    }
  } else {
    sendBadRequest(res);
  }
}

const login = async (req, res) => {
  if (validateUser(req.body)) {
    try {
      user = await User.getUserByEmail(req.body.email)
      if (user) {
        bcryp
          .compare(req.body.password, user.password)
          .then((result) => {
            if (result) {
              sendUserCookie(res, user);
              sendLoginSuccess(res, user);
            } else {
              sendWrongUser(res);
            }
          });
      } else {
        sendWrongUser(res);
      }
    } catch (error) {
      console.error(error);
      send500(res);
    }
  } else {
    sendBadRequest(res);
  }
}

const googleLogin = async (req, res) => {
  try {
    if (req.body.token) {
      payload = await getGooglePayload(req.body.token);
    } else {
      sendBadRequest(res);
      return;
    }
  } catch (error) {
    sendWrongUser(res);
    return;
  }
  try {
    const user = await User.getUserByEmail(payload['email']);
    if (user) {
      bcryp
        .compare(payload['sub'], user.password)
        .then((result) => {
          if (result) {
            sendUserCookie(res, user);
            sendLoginSuccess(res);
          } else {
            sendUserAlreadyExist(res);
          }
        });
    } else {
      bcryp.hash(payload['sub'], 10)
        .then(async (hash) => {
          const user = await createUser(
            payload['email'],
            payload['given_name'],
            hash
          );
          sendUserCookie(res, user);
          sendLoginSuccess(res);
        });
    }
  } catch (error) {
    console.error(error);
    send500(res);
  }
}

const facebookLogin = async (req, res) => {
  try {
    var certif = null;
    if (req.body.token && req.body.username) {
      const accessToken = await getFacebookApiAccessToken();
      const result = await axios.get(getFacebookCertifToken(accessToken, req.body.token));
      certif = result.data;
    } else {
      sendBadRequest(res);
      return;
    }
    if (certif.data.is_valid) {
      const user = await User.getUserByEmail(certif.data.user_id);
      if (user) {
        bcryp
          .compare(certif.data.user_id, user.password)
          .then((result) => {
            if (result) {
              sendUserCookie(res, user);
              sendLoginSuccess(res);
            } else {
              sendUserAlreadyExist(res);
            }
          });
      } else {
        bcryp.hash(certif.data.user_id, 10)
          .then(async (hash) => {
            const user = await createUser(
              req.body.username,
              certif.data.user_id,
              hash
            );
            sendUserCookie(res, user);
            sendLoginSuccess(res);
          });
      }
    } else {
      sendWrongUser(res);
    }
  } catch (error) {
    console.error(error);
    send500(res);
  }
}

const logout = (req, res) => {
  sendUserLogout(res);
}

//#endregion

//#region exports

module.exports  = {
  signup,
  login,
  logout,
  googleLogin,
  facebookLogin
}

//#endregion
