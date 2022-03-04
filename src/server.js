//Needed Requires
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler =  require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const mediaHandler = require('./mediaResponses.js');

//port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

//Needed struct for urls
const urlStruct = {
  'GET': {
    '/': htmlHandler.getIndex,
    '/style.css':htmlHandler.getCSS,
    '/checkCoverage': jsonHandler.checkCoverage,
    '/addType':jsonHandler.addType,
    '/notReal': jsonHandler.notReal,
    '/notRealMeta': jsonHandler.notRealMeta,
    '/background':mediaHandler.getBackground,
  },
  'HEAD':{
    '/notRealMeta': jsonHandler.notRealMeta,
  },
};

//Used to parse the body of a response and give it to the given handler
const parseBody = (request, response, handler) => {
  const body = [];
  
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
  
    handler(request, response, bodyParams);
  });
};

//Set to handle post requests
const handlePost = (request, response, parsedUrl) => {
  if(parsedUrl.pathname === '/addType') {
    parseBody(request, response, jsonHandler.addType);
  }
};

const onRequest = (request, response) => {
  //Parse the url
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST')
  //If the requset's method is a post then handle it
  {
    handlePost(request, response, parsedUrl);
  }
  else
  {
    //Otherwise check if the last character in the url is a T, if so then it is a request for a type image
    if(request.url.slice(-1) === "T")
    {
      mediaHandler.getType(request, response, request.url.slice(1, -1));
    }else{
      //Otherwise if the url exists in the struct
      if(urlStruct[request.method][parsedUrl.pathname]){
        const bodyParams = query.parse(parsedUrl.query);
  
        if(Object.keys(bodyParams).length === 1)
        //If the remaining url has parameters then send them
        {
          urlStruct[request.method][parsedUrl.pathname](request, response, request.method, bodyParams["fairyCheck"]);
        }
        else
        //If not just call
        {
          urlStruct[request.method][parsedUrl.pathname](request, response, request.method);
        }
      } else {
        //If not then send 404
        jsonHandler.notReal(request, response);
      }
    }
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});