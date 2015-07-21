/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var fs = require('fs');
var data = [{"roomname": "room1", "username": "John", "text": "hello", "objectId":0 },{"roomname": "room5", "username": "Jason", "text": "world","objectId":1 }];
var messageId = 2;

var requestHandler = function(request, response) {

  var responseObj = {};

  console.log("Serving request type " + request.method + " for url " + request.url);
  var parsedUrl = url.parse(request.url);
  var pathArray = parsedUrl.path.split('/');
  pathArray.shift();
  pathArray = pathArray.slice(-2);
  var headers = defaultCorsHeaders;

  if(request.method === 'GET'){
    
    headers['Content-Type'] = "application/json";
    var results = [];

    if(pathArray[1] === undefined){
      var statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
    else if(pathArray[1] === 'messages'){
      var statusCode = 200;
      response.writeHead(statusCode, headers);
      results = data;

    } else{ 
      var statusCode = 200;
      response.writeHead(statusCode, headers);
      for(var i = 0; i < data.length; i++){
        if(data[i].room === pathArray[1]){
          results.push(data[i]);
        }
      }
    }
    
    responseObj.results = results;
    response.end(JSON.stringify(responseObj));
  }
  else if (request.method === 'POST'){
    var statusCode = 201;
    var body = '';
    request.on('data', function(data){
      body += data;
    });
    request.on('end', function(){
      var newMessage = JSON.parse(body);
      newMessage['objectId'] = messageId;
      if(!newMessage.room){
        newMessage['room'] = pathArray[1];
      }

      data.push(newMessage)
      messageId++;

      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(newMessage));
    });    
  }
  
  else if(request.method === 'OPTIONS'){
    var statusCode = 200;
    response.writeHead(statusCode, defaultCorsHeaders);
    response.end();
  }

};



var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};


exports.requestHandler = requestHandler;