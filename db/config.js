const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Suman-1432:Suman1432@cluster0.bkkfmpr.mongodb.net/e-dashboard").then(()=>{
    console.log("mongodb connected successfully")
}).catch((err)=>{
    console.log(err)
})