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
var data = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

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
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    for(var i = 0; i < data.length; i++){
      if(data[i].room === pathArray[1]){
        results.push(data[i]);
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
      if(!newMessage.room){
        newMessage['room'] = pathArray[1];
      }

      data.push(newMessage)
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(newMessage));
    });
    
    
  }
  
};



var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;