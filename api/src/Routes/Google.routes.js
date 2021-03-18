const { Router } = require('express');
const { getGoogleEvents } = require('./../Controller/Google/GoogleCalendarController');
const { getRecentPhotos, getRandomPhotos } = require('../Controller/Google/GooglePhotoController');
const { login, callback, logout } = require('./../Controller/Google/GoogleAuthController')

const googleRouter = Router();

// Login / Logout routes
googleRouter.get('/login', login);
googleRouter.get('/callback', callback);
googleRouter.get('/logout', logout);

// Photos routes
googleRouter.get('/photos/recent', getRecentPhotos);
googleRouter.get('/photos/random', getRandomPhotos);

// Calendar routes
googleRouter.get('/calendar/events', getGoogleEvents);

module.exports = googleRouter;
