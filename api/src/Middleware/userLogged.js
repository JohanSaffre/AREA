const config = require('./../../config/config.json')

function isCallBackRoute(req) {
  const route =req.originalUrl.split('?')[0];
  return route === '/spotify/callback' || route === '/google/callback';
}

function ensureUserLoggedIn(req, res, next) {
  if (req.signedCookies.user_id  || isCallBackRoute(req) || config.cookie === false) {
    next();
  } else {
    res.status(401).send('Un-Authorized');
  }
}

module.exports = {
  ensureUserLoggedIn
}
