var express = require('express');
var router = express.Router();
const MongoDb = require('mongodb');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

async function authenticate(req,res,next) {

  try {

    if(req.headers.authorization !== undefined) {
        let verifyToken = await jwt.verify(req.headers.authorization,process.env.JWT);
        if(verifyToken.role === 'Manager' || verifyToken.role === 'Admin') {
          next();
        } else {
          res.json({
            "message" : "Sorry,You Don't Have Access For This Operation"
          })
        }
    } else {
      res.json({
        "message" : "Sorry,You Don't Have Access For This Operation"
      })
    }
  } catch (error) {
    res.json({
      "message" : "Technical Error"
    })
  }

}

router.get('/Requests', function(req, res, next) {
    res.send('Requests Working');
  });

router.post('/addRequest',[authenticate],async function(req,res){


    try {
      
        
        console.log(req.body);

        let url = process.env.DB;
        let client = await MongoDb.connect(url);
        let db = await client.db("users");
        let data = await db.collection("Requests").insertOne({

                Lead_Id : req.body.Lead_Id,
                Request_Id : req.body.Request_Id,
                Request : req.body.Request,
                Status : req.body.Status
        })
    
        console.log(data);

        res.json({
            "message" : "Request Added Successfully",
            "status" : "Success"
        })

        await client.close();
  
    } catch (error) {
      console.log(error);
    }
  })

router.get('/getRequests',async function(req,res){

    try {
  
      let url = process.env.DB;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Requests").find().toArray();
      console.log(data);
      await client.close();
  
      res.json(data)
    
    } catch (error) {
      console.log(error);
    }
  })

router.put('/updateRequest',[authenticate],async function(req,res){

    try {
  
      let url = process.env.DB;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Requests").updateOne(
        {_id: {$eq : MongoDb.ObjectID(req.body.id)}},
        {
          $set : {
            Lead_Id : req.body.Lead_Id,
            Request_Id : req.body.Request_Id,
            Request : req.body.Request,
            Status : req.body.Status
          }
        }
        )
        console.log(data);
  
      await client.close();
  
      res.json({
        "message" : "Request Updated Successfully"
      })
    
    } catch (error) {
      console.log(error);
    }
  })

router.delete('/deleteRequest/:id',[authenticate],async function(req,res){

    try {
  
      let url = process.env.DB;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Requests").deleteOne(
        {_id: {$eq : MongoDb.ObjectID(req.params.id)}}
        )
  
      await client.close();
  
      res.json({
        "message" : "Request deleted Successfully"
      })
    
    } catch (error) {
      console.log(error);
    }
  })

router.get('/requestsCount',async function(req,res){

    try {
  
      let url = process.env.DB;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Requests").count()
      console.log(data);
      await client.close();
  
      res.json(data)
    
    } catch (error) {
      console.log(error);
    }
  })

router.get('/verifyLeadId/:leadId',async function(req,res){

    try {
      let url = process.env.DB;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let result = await db.collection("Leads").findOne({Lead_Id : req.params.leadId})

      res.json({
        "result" : result
      })
    } catch (error) {
      console.log(error);
    }
  })
  module.exports = router;