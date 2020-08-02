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
router.get('/Leads', function(req, res, next) {
    res.send('Leads Working');
  });

router.post('/addLead',[authenticate],async function(req,res){


    try {
        
        console.log(req.body);

        let url = process.env.DB1;
        let client = await MongoDb.connect(url);
        let db = await client.db("users");
        let data = await db.collection("Leads").insertOne({

                Lead_Id : req.body.Lead_Id,
                Lead_Name : req.body.Lead_Name,
                Email : req.body.Email,
                Status : req.body.Status
        })
    
        console.log(data);

        res.json({
            "message" : "Lead Added Successfully",
            "status" : "Success"
        })

        await client.close();
  
    } catch (error) {
      console.log(error);
    }
  })

router.get('/getLeads',async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Leads").find().toArray();
      console.log(data);
      await client.close();
  
      res.json(data)
    
    } catch (error) {
      console.log(error);
    }
  })

router.put('/updateLead',[authenticate],async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Leads").updateOne(
        {_id: {$eq : MongoDb.ObjectID(req.body.id)}},
        {
          $set : {
            Lead_Id : req.body.Lead_Id,
            Lead_Name : req.body.Lead_Name,
            Email : req.body.Email,
            Status : req.body.Status
          }
        }
        )
        console.log(data);
  
      await client.close();
  
      res.json({
        "message" : "Lead Updated Successfully"
      })
    
    } catch (error) {
      console.log(error);
    }
  })

router.delete('/deleteLead/:id',[authenticate],async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Leads").deleteOne(
        {_id: {$eq : MongoDb.ObjectID(req.params.id)}}
        )
  
      await client.close();
  
      res.json({
        "message" : "Lead deleted Successfully"
      })
    
    } catch (error) {
      console.log(error);
    }
  })

  router.get('/leadsCount',async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Leads").count();
      console.log(data);
      await client.close();
  
      res.json(data)
    
    } catch (error) {
      console.log(error);
    }
  })

  module.exports = router;