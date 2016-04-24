
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('bookList',['bookList']);
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var http = require ('http');         // For serving a basic web page.


// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uri = 'mongodb://heroku_ppxqqb38:67ldeomkuuc9jdlgs89jimikvn@ds019101.mlab.com:19101/heroku_ppxqqb38';

//where to look for static files
app.use(express.static(__dirname +'/public'));
//parse json data
app.use(bodyParser.json());

mongodb.MongoClient.connect(uri, function(err, db){

    if(err) throw err;

    var books = db.collection('bk');

    //get
    bk.get('/bookList', function(req, res) {
        console.log("SEREVR: get request received")

        //find all books in db
        db.bookList.find(function(err,docs) {
            console.log(docs);
            //send data badk to controller
            res.json(docs);
        });

    });


    //post
    bk.post('/bookList', function(req, res) {
        //print data recived from command prompt
        console.log(req.body);
        req.body._id= 0;
        db.bookList.insert(req.body, function(err, doc) {
            //send back data to controller
            res.json(doc);
        });
    });

    //delete
    bk.delete('/bookList/:id', function(req, res) {
        var id = req.params.id;
        console.log(id);

        db.bookList.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
            res.json(doc);
        });
    });

    //edit
    bk.get('/bookList/:id', function(req, res) {
        var id = req.params.id;
        console.log(id);

        db.bookList.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
            res.json(doc);
        });

    });

    //update
    bk.put('/bookList/:id', function (req, res) {
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
}
app.listen(process.env.PORT);
console.log("SERVER RUNNING ON PORT 3000");