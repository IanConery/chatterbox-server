// Express JS Servervar express = require('express');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var data = [];

var objectId = 0;

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

  responseObj['results'] = data;
  res.json(responseObj);
});

//post data
app.post('/classes/messages/:room', function(req, res){
  var newMessage = req.body;
  newMessage['roomname']  = req.params.room;
  newMessage['objectId'] = objectId;

  objectId++;
  data.push(newMessage);
  res.send(JSON.stringify(newMessage));
});
app.post('/classes/messages', function(req, res){
  var newMessage = req.body;
  newMessage['objectId'] = objectId;

  objectId++;
  data.push(newMessage);
  res.send(JSON.stringify(newMessage));
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

//  console.log('Example app listening at http://%s:%s', host, port);
});