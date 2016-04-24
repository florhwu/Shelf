var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('bookList',['bookList']);
var bodyParser = require('body-parser');

//where to look for static files
app.use(express.static(__dirname +'/public'));
//parse json data
app.use(bodyParser.json());

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

app.listen(3000);
console.log("SERVER RUNNING ON PORT 3000");