var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const MongoDb = require('mongodb');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signUp',async function(req,res){

    try {

      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password,salt)
      req.body.password = hash

      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let email = await db.collection("userEmails").insertOne({"email" : req.body.email})
      let data = await db.collection("userList").insertOne({

        "email" : req.body.email,
        "firstName" : req.body.firstName,
        "lastName" : req.body.lastName,
        "password" : req.body.password,
        "role" : req.body.role

      })

      let jwtToken = await jwt.sign({email : req.body.email,role : req.body.role},process.env.JWT,{expiresIn : "1h"}) 
      await client.close();

      console.log(jwtToken);
      res.json({
        "token" : jwtToken,
        "message" : "Registration Successful"
      })
    
    } catch (error) {
      console.log(error);
    }
})

router.post('/signIn',async function(req,res){


  try {

    console.log(req.body);
    let url = process.env.DB1;
    let client = await MongoDb.connect(url);
    let db = await client.db("users");
    let result = await db.collection("userEmails").findOne({email : { $eq : req.body.email}})

    if(result !== null) {

      let user = await db.collection("userList").findOne({email : req.body.email})
      let result = await bcrypt.compare(req.body.password,user.password)
      if(result === true) {
        
        let jwtToken = await jwt.sign({email : req.body.email,role : user.role},process.env.JWT,{expiresIn : "1h"})

        res.json({
          "token" : jwtToken,
          "message" : "Authentication Successful",
          "status" : "Successful",
          "name" : user.firstName
        })

      } else {

        res.json({
          message : "Password does not match",
          "status" : "Not Successful"
        })

      }
    } else {
      res.json({
        "message" : "User Does not Exist!!",
        "status" : "Not Successful"
      })
    }
    await client.close();

  } catch (error) {
    console.log(error);
  }
})

router.get('/verifyEmail/:email',async function(req,res){
  try {
    let url = process.env.DB1;
    let client = await MongoDb.connect(url);
    let db = await client.db("users");
    let result = await db.collection("userEmails").findOne({email : { $eq : req.params.email}})
    res.json({
      "result" : result
    })
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
