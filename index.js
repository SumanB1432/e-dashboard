const express = require("express");
const cors = require("cors")
const app = express();
const dotnev = require("dotenv").config();
require("./db/config")
const user  = require("./db/user")

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("app is working")
})
app.post("/register",async (req,res)=>{
    let data = req.body;
    let insertData = await user.create(data);
    return res.status(201).send({status:true,data:insertData})
})
app.listen(process.env.PORT,(err)=>{
    if(!err){
        console.log(`CONNECTED TO SERVER SUCCESSFULLY IN ` )
    }
})