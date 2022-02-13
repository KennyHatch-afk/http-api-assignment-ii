const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler =  require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    'GET': {
        '/': htmlHandler.getIndex,
        '/style.css':htmlHandler.getCSS,
        '/getUsers': jsonHandler.getUsers,
        '/addUser':jsonHandler.addUser,
        '/notReal': jsonHandler.notReal
    },
    'HEAD':{
        '/getUsers': jsonHandler.getUsersMeta,
        '/notReal': jsonHandler.notRealMeta,
    },
};

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

const handlePost = (request, response, parsedUrl) => {
    if(parsedUrl.pathname === '/addUser') {
      parseBody(request, response, jsonHandler.addUser);
    }
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    
    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    } else {
        if(urlStruct[request.method][parsedUrl.pathname]){
            urlStruct[request.method][parsedUrl.pathname](request, response);
          } else {
            urlStruct[request.method].notReal(request, response);
        }
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});