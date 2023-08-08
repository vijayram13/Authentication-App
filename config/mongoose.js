// import mongoose
const mongoose = require('mongoose');

// Mongodb url to connect  the database
const cloudDB = process.env.mongodb;
mongoose.connect(cloudDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{return;})
.catch((err) =>{console.log("DB is not connected",err);});



