const mongoose = require('mongoose');

const cloudDB = process.env.mongodb;
mongoose.connect(cloudDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{console.log("Cloud MongoDB connected Successfully..");})
.catch((err) =>{console.log("Cloud MongoDB is not connected",err);});



