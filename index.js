// import packages
const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');
const dotenv = require("dotenv");   // to store secret data
const expressEjsLayouts = require('express-ejs-layouts');   // for static layouts    
const mongoStore = require('connect-mongo');    // store the session data in mongoDB
const passport = require('passport');
const flash = require('connect-flash');
// dotenv configuration
dotenv.config({path:'./config.env'});

// express application
const app = express();
const port = process.env.PORT;


//database connection
const db = require("./config/mongoose");




// google oauth
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-strategy');

//custom middleware for flash messages
const customMiddleware = require('./config/middleware');


// static files
app.use(express.static(path.join(__dirname, 'assets')));


// express-ejs-layouts for static layouts
app.use(expressEjsLayouts);     // express-ejs-layouts setup
app.set("layout extractStyles", true)   //export style from subfolder
app.set("layout extractScripts", true)  //export scripts from subfolder

//ejs setup
app.set('view engine', 'ejs');

// direct access views by views name only
app.set('views', path.join(__dirname, 'views'));   




// to get encoded data from client side
app.use(express.urlencoded({extended: true}));


app.use(session({
    name: process.env.userId, //Name of the cookie to be sent in the response (default: 'connect.sid')
    secret: process.env.SESSIONSECRET, // TODO: change the secret before deployment in production mode
    saveUninitialized: false, // Whether to save uninitialized sessions (false recommended to comply with GDPR laws)
    resave: false,  // Whether to save the session if it's not modified (false recommended for optimization)
    // cookie: {
    //     //validation time of cookie
    //     maxAge: (1000*60) // Expiration time of the session cookie in milliseconds 
    // },
    store: mongoStore.create(
    {
        mongoUrl:process.env.mongodb,
        // autoRemove: 'disabled'
        ttl: 1000*60*60*24*7,   // TTL of the session cookie (1 week in milliseconds)
    },(err) =>{
        console.log("Mongoose Error: " + err);
    })
    
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// flash Setup for notification
app.use(flash());
// custom middleware for flash messages
app.use(customMiddleware.setFlash);

// routes
app.use(require('./routes/routes'));

app.listen(port,(err) =>{
    if(err){return console.log(port," Server not Listening");}
    return console.log(`server listening on ${port}`);
});