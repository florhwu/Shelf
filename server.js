
var express = require('express');
var mongojs = require('mongojs');
// var db = mongojs('bookList',['bookList']);
var bodyParser = require('body-parser');
var http = require('http'); 
var url = require('url');
var mongodb = require('mongodb');

var app = express();

//where to look for static files
app.use(express.static(__dirname +'/public'));
app.use(bodyParser.json());

// Connection URL
var uri = 'mongodb://heroku_9fpb00cc:e3fghoh83m0mko4sf8acj318aa@ds061318.mlab.com:61318/heroku_9fpb00cc';
//db user: heroku_9fpb00cc
//db passworld: e3fghoh83m0mko4sf8acj318aa
//host: ds061318.mlab.com
//port: 61318
//db name: heroku_9fpb00cc

var seedData = [{
    name: 'Atlas Shrugged',
    author: 'Ayn Rand',
    genre: 'fic'
}];

mongodb.MongoClient.connect(uri, function(err, db) {
  
    if(err) throw err;

    /*
    * First we'll add a few songs. Nothing is required to create the 
    * songs collection; it is created automatically when we insert.
    */

    var bookList = db.collection('bookList');

    // Note that the insert method can take either an array or a dict.

    bookList.insert(seedData, function(err, result) {

        if(err) throw err;  

        //get
        app.get('/bookList', function(req, res) {
            console.log("SEREVR: get request received")

            //find all books in db
            bookList.find().toArray(function(err, docs) {
                if(err) throw err;
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
            bookList.insert(req.body, function(err, doc) {
                if(err) throw err;
                //send back data to controller
                res.json(doc);
            });
        });

        //delete
        app.delete('/bookList/:id', function(req, res) {
            var id = req.params.id;
            console.log(id);

            bookList.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
                if(err) throw err;
                res.json(doc);
            });
        });

        //edit
        // app.get('/bookList/:id', function(req, res) {
        //     var id = req.params.id;
        //     console.log(id);

        //     bookList.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
        //         if(err) throw err;
        //         res.json(doc);
        //     });

        // });

        //update
        app.put('/bookList/:id', function (req, res) {
            var id = req.params.id;
            console.log("id is: " + id);
            console.log("req body name: " + req.body.name);
            bookList.findAndModify({
                query: {_id: mongojs.ObjectId(id)},
                update: {$set: {name: req.body.name, author: req.body.author, genre: req.body.genre}},
                new: true}, function (err, doc) {
                    if(err) throw err;
                    res.json(doc);
                })
            });
    });
});

app.listen(process.env.PORT || 3000);
