/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

// example of DB connection
//process.env.DB='mongodb://localhost/issue_tracker';
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
    
      // checking for query param
      let databaseInputs = {...req.query};
      if(databaseInputs.hasOwnProperty('_id')) {
        try{
          databaseInputs._id = ObjectId(databaseInputs._id);
        } catch(err){
          return res.send('_id error');
        }
      }
        
      //retriving data
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        // in case where something went wrong
        if(err) console.log('Database error: ' + err);
        // otherwise
        else {
          console.log('Successfully connected to the database');
          var cursor = db.collection(project)
            .find(databaseInputs)
            .toArray( (error, DBRes) => {
              // in case where something went wrong
              if(error) console.log('Find error');
              // otherwise
              res.json(DBRes);
            });
        }
      });
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      // we check if the required fields are there
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by)
        return res.send('required field empty');
      
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        // in case where something went wrong
        if(err) console.log('Database error: ' + err);
        // otherwise
        else {
          console.log('Successfully connected to the database');
          db.collection(project)
            .insertOne({
              issue_title: req.body.issue_title,
              issue_text:  req.body.issue_text,
              created_by:  req.body.created_by,
              assigned_to: req.body.assigned_to || '',
              status_text: req.body.status_text || '',
              created_on:  new Date(),
              updated_on:  new Date(),
              open:        true
              }, (err, DBRes) => {
                return res.json(DBRes.ops[0]);
              });
        }
      });
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
    
      // check if any data provided and filter
      let databaseInputs = { ...req.body };

      Object.keys(databaseInputs).forEach(elem => {
          if( databaseInputs[elem] == '' || elem == '_id')
              delete databaseInputs[elem];
      });
      // connection to the database
      if(Object.keys(databaseInputs).length > 0) {
        
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          // in case where something went wrong
          if(err) console.log('Database error: ' + err);
          // otherwise
          else {
            console.log('Successfully connected to the database');
            
            let newId;
            try {
              newId = ObjectId(req.body._id);
            }
            catch(err){
              if(err) return res.send('could not update '+req.body._id);
            }

            db.collection(project)
              .updateOne(
                {
                  _id: newId 
                }, {$set: {
                  ...databaseInputs,
                  updated_on:  new Date()
                }}, (err, DBRes) => {
                  // in case where something went wrong
                  if(err) {
                    console.log('Update errot: ' + err);
                    return res.send('could not update '+req.body._id);
                  }
                  // otherwise
                  return res.send('successfully updated');
                });
          }
        });
      }
      else
        return res.send('no updated field sent');
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      // in case where the id is invalid
      if(req.body._id == '' || req.body._id == undefined)
        return res.send('_id error');
      
      // otherwise
      let newId;
      try {
        newId = ObjectId(req.body._id);
      } catch(err){
        if(err) return res.send('could not update '+req.body._id);
      }
    
      //delete issue
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
          if(err) console.log('Database error: ' + err);
          else {
            console.log('Successfully connected to the database');
            db.collection(project)
              .deleteOne(
                {_id: newId}, 
                (err, DBRes) => {
                  if(err) return res.send('could not update '+req.body._id);
                  return res.send('deleted '+req.body._id);
                });
          }
        });
    
    });
    
};
