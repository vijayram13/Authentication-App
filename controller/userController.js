const express = require('express');
//for encryption
const bcrypt = require('bcrypt');  
// user model call
const userModel = require('../models/userModel');
// passport middleware
const passport = require('passport');


// redirect ("/")
module.exports.home = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile"); 
    }
    return res.redirect("/login");
    
    
};

//Signup page
module.exports.signup = (req, res) => {
    // check authentication and redirect to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }

    return res.render('signup-page', {
        title: 'signup',
        log: 'Sign in',
        link: '/'
    });
};

//create a new user using signup form
module.exports.createUser = (req, res) => {

    // password and confirm password not matching
    if (req.body.password != req.body.conf_password) {
        
        req.flash('error',"Password not match");
        return res.redirect('back');
    }

    // find user by email in Database
    userModel.findOne({ 'email': req.body.email })
        .then(user => {
            // create user (email not existing)
            if (!user) {
                bcrypt.hash(req.body.password, 10)
                    .then((hash, err) => {
                        if (err) { return res.redirect("back"); }
                        else {
                            req.body.password = hash;
                            // user object
                            const userObj = {
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                                profilePictureURL: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                            }
                            //add user to db
                            userModel.create(userObj)
                                .then(() => {
                                    
                                    req.flash("success", "User saved successfully");
                                    return res.redirect('/');
                                })
                                .catch((err) => { 
                                    req.flash("error", err);
                                    res.redirect('back');
                                });
                        }

                    })
                    .catch((err) => {
                        req.flash("error", err);
                        res.redirect('back');
                    })


            }
            else {
                req.flash("success", "Already have an Account");
                return res.redirect('/');
            }
        })
        .catch(err => { 
            req.flash("error", err);
            return res.redirect('back'); 
        });


};

// login page
module.exports.login = function (req, res,next) {
    // check authentication and redirect to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }
    return res.render('login-page', {
        title: 'login',
        log: "",
        link: '',
    });
    
    

};

// user session 
module.exports.userSession = function (req, res) {

    userModel.findOne({ email: req.body.email })
        .then((user) => {
            
            if (user) {
                const isMatch = bcrypt.compareSync(req.body.password, user.password);
                if (isMatch) {
                    req.flash('success', "Logged in successfully");
                    return res.redirect("/profile");

                }
                else{
                    req.flash('error', "Invalid Email/Password");
                    return res.redirect("/");
                }
      
            }
            
         
        })
        .catch((err) => { 
            req.flash("error", err);
            return res.redirect('/');
         })

};


//profile page
module.exports.profile = (req, res) => {
    if (req.isAuthenticated()) {
        
        return res.render('profile-page', {
            title: 'profile',
            log: "Sign Out",
            link: '/signout',
            local: true
        });

    }

    return res.redirect('back');

}

//SignOut 
module.exports.signOut = function (req, res) {
    // to logout the user 
    req.logout((err) => {

        if (err) {
            req.flash("error", err);
            return res.redirect('/');
        }
        req.flash("success", "Signed Out Successfully");
        return res.redirect('/');
    });

}

// reset page
module.exports.resetPassword = function (req, res) {
    if(req.isAuthenticated()) {
        return res.render("reset-page", {
            title: 'profile',
            log: "Sign Out",
            link: '/signout'
        });
    }
    return res.redirect("back");
    

};

// reset password
module.exports.reset = function (req, res) {
    if (req.isAuthenticated()) {
        
        const userPassword = bcrypt.compareSync(req.body.oldPassword, req.user.password);

        if (userPassword) {
            userModel.findOne({ email: req.body.email })
                .then((user) => {
                    if (req.body.newPassword === req.body.conf_newPassword) {
                        const encryptNewPassword = bcrypt.hashSync(req.body.newPassword, 10);
                        userModel.updateOne({ password: req.user.password }, { password: encryptNewPassword })
                            .then(() => { 
                                req.flash('success', 'Reset Password Successfully'); });

                    }

                    res.redirect('/profile');
                })
                .catch((err) => {
                    req.flash('error', err);
                    res.redirect("back");
                });
        }




    }


};