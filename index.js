const express = require("express");
const app = express();
const dotnev = require("dotenv").config()
app.get("/",(req,res)=>{
    res.send("app is working")
})

app.listen(process.env.PORT,(err)=>{
    if(!err){
        console.log(`CONNECTED TO SERVER SUCCESSFULLY IN ` )
    }
})