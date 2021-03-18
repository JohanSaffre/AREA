const { Router } = require('express');
const { getAbout } = require('./../Controller/About/AboutController');
const { ensureUserLoggedIn } = require('./../Middleware/userLogged');

const router = new Router();

// User Routess
router.use('/users', require('./Users.routes'));

// Services Routes
router.use('/spotify', ensureUserLoggedIn, require('./Spotify.routes'));
router.use('/google', ensureUserLoggedIn, require('./Google.routes'));

// About.json Route
router.get('/about.json', getAbout);

module.exports = router;
