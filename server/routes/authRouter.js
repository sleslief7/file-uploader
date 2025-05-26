const { Router } = require('express');
const { signUp, logIn, logOut } = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/signUp', signUp);
authRouter.post('/logIn', logIn);
authRouter.post('/logOut', logOut);

module.exports = authRouter;
