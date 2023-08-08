const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require('crypto');   // to auto generate a password
const User = require('../models/userModel');



// google strategy
passport.use(new GoogleStrategy(
    {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL

    },
    function(req,accessToken, refreshToken,profile,cb) {
        User.findOne({email: profile.emails[0].value})
        .then((user) => {
            if(user){
                // return user details
                return cb(null, user);
            }
            else{
                // create a new profile
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(10).toString('hex'),
                    profilePictureURL: profile.photos[0].value
                })
                .then((user,err) => {
                    if(err){
                        req.flash('error',"Invalid !");
                        console.log('Error in creating user google strategy-passport', err); return;
                    }
                    return cb(null, user);
                });

            }

        })
    }
));

passport.serializeUser(function(user,cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj,cb) {
    cb(null, obj);
});

module.exports = passport;