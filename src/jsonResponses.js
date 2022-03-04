const axios = require('axios');
const types = {};
const offensiveCoverage = {};

//Respond with JSON body and header
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

//Respond with just header
const respondJSONMeta = (request, response, status) => {
  const headers = {};

  response.writeHead(status, headers);
  response.end();
};

//Store type into the API
const addType = (request, response, body) => {
  //Preliminary message
  const responseJSON = {
    message: 'That type was already being checked.',
  };
  
  //Preliminary status code
  let responseCode = 204;

  //If the stored values are empty then change the status code
  if(Object.keys(types).length === 0) {
    responseCode = 201;
  }
  else{
    //Otherwise check to see if given value is a repeat
    let repeat = false;

    Object.keys(types).forEach(element => {
      if(element === body.type)
      {
        repeat = true;
      }
    });
  
    //If it is a repeat given 400 bad request error
    if (repeat) {
      responseJSON.id = 'invalid';
      return respondJSON(request, response, 400, responseJSON);
    }
  }

  //Store remaining value
  types[body.type] = {
    name: body.type,
  };
  
  //If the value was the first stored, then respond with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

//Pull from external API to check weaknesses and relay them to client
const checkCoverage = async (request, response, method, params) => {
  const responseJSON = {};

  //If the button was pressed while no values are stored, then give 400 bad request error.
  if(Object.keys(types).length === 0)
  {
    respondJSON.message = "There are no types inputted.";
    return respondJSON(request, response, 400, responseJSON); 
  }

  let url = "";

  //For each stored type
  Object.keys(types).forEach(async function(element){
    
    //Ping the external API
    url = "https://pokeapi.co/api/v2/type/";
    url += element;
    const res = await axios.get(url);

    let checked = false;

    //Check the returned JSON data for the types it deals double damage to
    Object.keys(res.data.damage_relations.double_damage_to).forEach(function(key1){
      checked = false;

      //If fairy is to be excluded
      if(params)
      {
        //Then don't add any values to output if the type being checked is fairy or if the value to store is fairy
        if(element === "fairy" || res.data.damage_relations.double_damage_to[key1].name === "fairy")
        {
          checked = true;
        }
      }

      //If the value being returned is a repeat, don't return it.
      Object.keys(offensiveCoverage).forEach(function(key2){
        if(res.data.damage_relations.double_damage_to[key1].name === offensiveCoverage[key2].name)
        {
          checked = true;
        }
      })

      //Don't return if any ignore calls have been sent
      if(!checked)
      {
        offensiveCoverage[res.data.damage_relations.double_damage_to[key1].name] = {
          name: res.data.damage_relations.double_damage_to[key1].name,
        }
      }
    })

    //If the method was head then return just header
    if(method === "head")
    {
      return respondJSONMeta(request, response, 200);
    }

  });
  
  //Return remaining data
  return respondJSON(request, response, 200, offensiveCoverage);
};
  
//If a 404 not real error was sent, respond with appropriate body
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  
  respondJSON(request, response, 404, responseJSON);
};
  
//If a 404 not real error was sent via HEAD, just send header
const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  addType,
  checkCoverage,
  notReal,
  notRealMeta,
};