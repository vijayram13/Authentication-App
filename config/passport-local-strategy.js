const express = require("express");
const passport = require('passport');
const bcrypt = require('bcrypt');
// db model call
const userModel = require('../models/userModel');

// local Strategy call rom passportjs
const LocalStrategy = require('passport-local').Strategy;

// Authentication using passport
passport.use(new LocalStrategy(
    { 
        usernameField: 'email',
        passReqToCallback: true     //to add a  request as parameter
    },
    
    (req,email, password,done) => {
        userModel.findOne({ email: email })
            .then((user, err) => {
    
                // if error occurs during finding the user
                if (err) {
                    
                    return done(err);
                };
                
                if (!user || user == null) {
                    req.flash("error", "Invalid Email/Password");
                    return done(null, false);
                }
                // compare password with db password
                const isMatch = bcrypt.compareSync(password, user.password);
                
                if (isMatch === false) {
                    
                    req.flash("error", "Invalid Email/Password");
                    return done(null, false);
                }
                // return user if found
                return done(null, user);

            })
    }));


//Serializing the user_id
passport.serializeUser(function (user, done) {
    // Store only the unique identifier of the user in the session
    done(null, user.id);
});

//deserializing the user
passport.deserializeUser(function (id, done) {
    // Retrieve the user object based on the serialized data
    userModel.findById(id)
        .then((user, err) => {
            done(err, user);
        })

});



//check if the user is  authenticated 
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // redirect to login page if user is not authenticated
    return res.redirect('back');
};

// set the user to locals
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        // store user in locals to use it views or anywhere
        res.locals.user = req.user;
    }
    return next();
};

module.exports = passport;
