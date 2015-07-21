// Express JS Servervar express = require('express');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var data = [];

var objectId = 0;

mongoose.connect('mongodb://127.0.0.1/chatterbox');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("yay!");
});

var messageSchema = mongoose.Schema({
  text: String,
  username: String,
  roomname: String,
  objectId: Number
});

var Message = mongoose.model('Message', messageSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//get data
app.get('/classes/messages/:room', function (req, res) {
  //res.render(req.params.room)
  var results = [];
  var responseObj = {};
  data.forEach(function(dataObj){
    if(dataObj.roomname === req.params.room){
      results.push(dataObj);
    }
  });
  responseObj['results'] = results;
  res.send(JSON.stringify(responseObj));
});
app.get('/classes/messages', function (req, res) {
  //res.render(req.params.room)
  var responseObj = {};

  Message.find(function (err, messages) {
    if (err) return console.error(err);
      responseObj['results'] = messages;
      res.json(responseObj);
  });
});

//post data
app.post('/classes/messages/:room', function(req, res){
  var postMessage = req.body;
  postMessage['roomname']  = req.params.room;
  postMessage['objectId'] = objectId;

  var newMessage = new Message({
    text: postMessage.text,
    roomname: postMessage.roomname,
    username: postMessage.username,
    objectId: postMessage.objectId
  })

  objectId++;
  newMessage.save(function (err) {
    if (err) return console.error(err);
  });

  res.send(JSON.stringify(postMessage));
});
app.post('/classes/messages', function(req, res){
  var postMessage = req.body;
  postMessage['objectId'] = objectId;

  var newMessage = new Message({
    text: postMessage.text,
    roomname: postMessage.roomname,
    username: postMessage.username,
    objectId: postMessage.objectId
  })

  newMessage.save(function (err) {
    if (err) return console.error(err);
      objectId++;
      res.send(JSON.stringify(postMessage));
  });
  
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

//  console.log('Example app listening on port %s', port);
});