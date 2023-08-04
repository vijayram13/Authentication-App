const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../controller/userController');

// loginPage 
router.get('/', controller.home);

//signup page
router.get('/signup', controller.signup);
//login page
router.get('/login', controller.login);
// logout session
router.get('/signout', controller.signOut);

// profile page
router.get('/profile', passport.checkAuthentication, controller.profile);

// post the signup form to create a new user account
router.post('/signup', controller.createUser);

// post the signup form to create a new user account
router.post('/signin',
    passport.authenticate('local',
    {failureRedirect: '/login'}),
    controller.userSession);


// reset password
router.get('/reset-password', controller.resetPassword);
router.post('/reset-password', controller.reset);



// google Oauth routes
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        req.flash('success',"Logged in Successful");
        res.redirect("/profile");
        
    }
);
module.exports = router;