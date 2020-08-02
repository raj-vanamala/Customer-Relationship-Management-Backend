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


router.get('/Contacts', function(req, res, next) {
    res.send('Contacts Working');
  });

router.post('/addContact',[authenticate],async function(req,res){


    try {
      
        
        console.log(req.body);

        let url = process.env.DB1;
        let client = await MongoDb.connect(url);
        let db = await client.db("users");
        let data = await db.collection("Contacts").insertOne({

                Lead_Id : req.body.Lead_Id,
                Mobile1 : req.body.Mobile1,
                Mobile2 : req.body.Mobile2
        })
    
        console.log(data);

        res.json({
            "message" : "Contact Added Successfully",
            "status" : "Success"
        })

        await client.close();
  
    } catch (error) {
      console.log(error);
    }
  })

router.get('/getContacts',async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Contacts").find().toArray();
      console.log(data);
      await client.close();
  
      res.json(data)
    
    } catch (error) {
      console.log(error);
    }
  })

router.put('/updateContact',[authenticate],async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Contacts").updateOne(
        {_id: {$eq : MongoDb.ObjectID(req.body.id)}},
        {
          $set : {
            Lead_Id : req.body.Lead_Id,
            Mobile1 : req.body.Mobile1,
            Mobile2 : req.body.Mobile2
          }
        }
        )
        console.log(data);
  
      await client.close();
  
      res.json({
        "message" : "Contact Updated Successfully"
      })
    
    } catch (error) {
      console.log(error);
    }
  })

router.delete('/deleteContact/:id',[authenticate],async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Contacts").deleteOne(
        {_id: {$eq : MongoDb.ObjectID(req.params.id)}}
        )
  
      await client.close();
  
      res.json({
        "message" : "Contact deleted Successfully"
      })
    
    } catch (error) {
      console.log(error);
    }
  })

router.get('/contactsCount',async function(req,res){

    try {
  
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let data = await db.collection("Contacts").count();
      console.log(data);
      await client.close();
  
      res.json(data)
    
    } catch (error) {
      console.log(error);
    }
  })

router.get('/verifyLeadId/:leadId',async function(req,res){

    try {
      let url = process.env.DB1;
      let client = await MongoDb.connect(url);
      let db = await client.db("users");
      let result = await db.collection("Leads").findOne({Lead_Id : req.params.leadId})

      console.log('this is verifying lead id',result)
      res.json({
        "result" : result
      })
    } catch (error) {
      console.log(error);
    }
  })

  module.exports = router;