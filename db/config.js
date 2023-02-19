const mongoose = require("mongoose");
const dotnev = require("dotenv").config();
mongoose.set('strictQuery', false);
mongoose.connect(`${process.env.MONGO_URL}`).then(()=>{
    console.log("mongodb connected successfully")
}).catch((err)=>{
    console.log(err)
})