
var express = require('express');
var mongojs = require('mongojs');
// var favicon = require('serve-favicon');
// var db = mongojs('bookList',['bookList']);
var bodyParser = require('body-parser');
// var mongodb = require('mongodb');
var http = require('http'); 
var url = require('url');
// var client = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var app = express();
// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.

var dbConnUrl = process.env.MONGOLAB_URI ||
    'mongodb://127.0.0.1:3000/bookList'

console.log('db server: ' + dbConnUrl)

//where to look for static files
app.use(express.static(__dirname +'/public'));
//parse json data
app.use(bodyParser.json());

// client.connect(dbConnUrl, {}, function(err, db){

//     console.log('error: ' + err)
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});
    //get
    app.get('/bookList', function(req, res) {
        console.log("SEREVR: get request received")

        //find all books in db
        db.bookList.find(function(err,docs) {
            console.log(docs);
            //send data badk to controller
            res.json(docs);
        });

    });


    //post
    app.post('/bookList', function(req, res) {
        //print data recived from command prompt
        console.log(req.body);
        req.body._id= 0;
        db.bookList.insert(req.body, function(err, doc) {
            //send back data to controller
            res.json(doc);
        });
    });

    //delete
    app.delete('/bookList/:id', function(req, res) {
        var id = req.params.id;
        console.log(id);

        db.bookList.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
            res.json(doc);
        });
    });

    //edit
    app.get('/bookList/:id', function(req, res) {
        var id = req.params.id;
        console.log(id);

        db.bookList.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
            res.json(doc);
        });

    });

    //update
    app.put('/bookList/:id', function (req, res) {
      var id = req.params.id;
      console.log("id is: " + id);
      console.log("req body name: " + req.body.name);
      db.bookList.findAndModify({
        query: {_id: mongojs.ObjectId(id)},
        update: {$set: {name: req.body.name, author: req.body.author, genre: req.body.genre}},
        new: true}, function (err, doc) {
          res.json(doc);
        }
      );
    });
// });
app.listen(3000);
console.log("SERVER RUNNING ON PORT 3000");