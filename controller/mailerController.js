const express = require('express');
// user model call
const userModel = require('../models/userModel');
//for encrypted tokens/password
 const crypto = require('crypto');

 //for encryption
const bcrypt = require('bcrypt');  
const nodeMailer = require("../config/nodemailer");



// create password for user  
function generatePassword(length) {
    const randomBytes = crypto.randomBytes(length);
    return randomBytes.toString("hex"); // or 'base64' for base64 encoding
  }
  



module.exports.send = async(req,res) => {
    console.log(req.body);
    console.log(process.env.DOMAIN);
    // genrate password for user
    const generate = generatePassword(4);

    let newPassword = bcrypt.hashSync(generate, 10); ;
    // find user by email in database
    const user = await userModel.findOneAndUpdate({ email: req.body.email}, { password: newPassword },{new: true});
    if (user) {
        
        
        // send the mail to user 
        nodeMailer.transporter.sendMail({
            from: process.env.DOMAIN,
            to: req.body.email,
            subject: "Authentication App Reset Password",
            html: `<p>Hello ${user.name} your new password: <b>${generate}</b></p>`
                
        })
        .then((err,info) => {
            if (err) {
                console.log("nodemailer Error: ",err);
            }
            else{
                console.log("Nodemailer Info: ",info);
                // update the user password
                
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    }
    else{
        console.log("No user found");
    }
    
    
    req.flash("success","Mail Sent Successfully");
    return res.redirect("back")

}