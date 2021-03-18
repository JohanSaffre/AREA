const { Router } = require('express');
const { login, googleLogin, signup, logout, facebookLogin } = require('./../Controller/User/UserAuthController')
const { ensureUserLoggedIn } = require('./../Middleware/userLogged')
const { getUserServices } = require('./../Controller/User/UserServiceController');
const { getUserWidgets, setUserWidgets } = require('./../Controller/User/UsersWidgetController');
const { getUsername } = require('./../Controller/User/UserInfoController');
const userRouter = Router();

// Login routes
userRouter.post('/login', login);
userRouter.post('/login/google', googleLogin);
userRouter.post('/login/facebook', facebookLogin);
userRouter.post('/signup', signup);
userRouter.post('/logout', logout);

// Services / Widgets routes
userRouter.get('/services', ensureUserLoggedIn, getUserServices)
userRouter.get('/widgets', ensureUserLoggedIn, getUserWidgets)
userRouter.post('/widgets', ensureUserLoggedIn, setUserWidgets)

// User info routes
userRouter.get('/username', ensureUserLoggedIn, getUsername)

module.exports = userRouter;
