const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user_controller');

router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);
router.get('/sign-out', userController.destroySession);


router.post('/create-session',
    passport.authenticate('local', { failureRedirect: '/users/sign-in' }),//When you call passport.authenticate('local'), it internally invokes the configured local strategy's authentication logic that you defined using passport.use()
    userController.createSession);


//create new user and then authenticating and then login(directly creating session cookie)
router.post('/create',
    userController.create,
    passport.authenticate('local'),
    userController.createSession);



router.get('/forgetPassword', userController.forgetPasswordPage);
router.post('/forgetPasswordLink', userController.forgetPasswordLink);

module.exports = router;