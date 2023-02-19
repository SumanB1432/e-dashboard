const express = require("express");
const cors = require("cors")
const app = express();
const dotnev = require("dotenv").config();
require("./db/config")
const user = require("./db/user");
const jwt = require("jsonwebtoken");
const product = require("./db/product");

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("app is working")
})
app.post("/register", async (req, res) => {
    try {
        let data = req.body;
        if(!data){
            return res.status(400).send("please provide your details")
        }
        let insertData = await user.create(data);    
        let User = {
            "_id": insertData._id,
            "name": insertData.name,
            "email": insertData.email
        }
        jwt.sign(User,`${process.env.JWT_KEY}`,{expiresIn:"2h"},(err,token)=>{

            if(err){
                return res.status(400).send({result:"SOME INTERNAL SERVER ERROR OCCURRED, PLEASE TRY AFTER SOME TIME "})
            }
            return res.status(200).send({User,auth : token})

        })
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email) {
            return res.status(400).send("please provide email address")
        }
        if (!password) {
            return res.status(400).send("please provide password")
        }
        let User = await user.findOne(req.body).select("-password");
        if (User) {
            jwt.sign({User},`${process.env.JWT_KEY}`,{expiresIn:"2h"},(err,token)=>{

                if(err){
                    return res.status(400).send({result:"SOME INTERNAL SERVER ERROR OCCURRED, PLEASE TRY AFTER SOME TIME "})
                }
                return res.status(200).send({User,auth : token})

            })
            
        }
        else {
            return res.status(404).send({result:"user not found"})
        }
    }
    catch (err) {
        return res.status(500).send(err)
    }

})

app.post("/add-product",verifyToken,async (req,res)=>{
    try {
        let data = req.body;
        if(!data){
            return res.status(400).send("please provide product details")
        }
        let insertProduct = await product.create(data);
       
        return res.status(201).send({ status: true, result: insertProduct })
    }
    catch (err) {
        return res.status(500).send(err)
    }

    
})

app.get("/get-product",verifyToken,async (req,res)=>{
    try {
        let products = await product.find();
        if(products.length>0){
            return res.status(200).send(products)
        }
        else{
            return res.status(404).send({result:'no result found'})
        }
        
    } catch (error) {
        return res.status(500).send(error)
        
    }
})

app.delete("/product/:id",verifyToken ,async(req,res)=>{
    try{
    let id = req.params.id;
    const result = await product.deleteOne({_id:id});
    return res.status(200).send(result)
    }
    catch(err){
        return res.status(500).send({status:false,message:err})
    }

})

app.get("/product/:id",verifyToken,async(req,res)=>{
  try {
    let id = req.params.id;
    let result = await product.findOne({_id:id});
    if(result){
        return res.status(200).send(result)
    }
    else{
        return res.status(404).send({status:false,message:"no result found"})
    }
    
  } catch (error) {

    return res.status(500).send({status:false,message:error})
    
  }


})

app.put("/product/:id",verifyToken, async (req, resp) => {
    try{
    let result = await product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    return resp.status(200).send(result)
    }
    catch(err){
        return resp.status(500).send({status:false,message:err})
    }
});

app.get("/search/:key",verifyToken, async (req, resp) => {
    try{
    let result = await product.find({
        "$or": [
            {
                name: { $regex: req.params.key }  
            },
            {
                company: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            }
        ]
    });
    
   return  resp.status(200).send(result);
}
catch(err){
    return resp.status(500).send({status:false,message:err})
}
})

function verifyToken(req,res,next){
    const token = req.headers['authorization'];
    // console.log(token)
    if(token){
        jwt.verify(token,process.env.JWT_KEY,(err,val)=>{

            if(err){
                return res.status(403).send({result:"You are not authorized"})
            }
            else{
                next()
            }
        })
        
    }
    else{
        return res.status(401).send({result:"Pleae send the token"})
    }
  
}


app.listen(process.env.PORT, (err) => {
    if (!err) {
        console.log(`CONNECTED TO SERVER SUCCESSFULLY IN `)
    }
})