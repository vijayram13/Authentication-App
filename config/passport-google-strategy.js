const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require('crypto');
const User = require('../models/userModel');



// console.log( process.env.clientID);
passport.use(new GoogleStrategy(
    {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL

    },
    function(accessToken, refreshToken,profile,cb) {
        User.findOne({email: profile.emails[0].value})
        .then((user) => {
            if(user){
                // console.log("Login Successful");
                return cb(null, user);
            }
            else{
                // console.log("create new User");
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    profilePictureURL: profile.photos[0].value
                })
                .then((user,err) => {
                    if(err){
                        if (err){console.log('Error in creating user google strategy-passport', err); return;}
                        return done(null, user);
                    }
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