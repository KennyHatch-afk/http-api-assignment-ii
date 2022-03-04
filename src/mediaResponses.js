const fs = require('fs');

//Find background image
const background = fs.readFileSync(`${__dirname}/../client/background.png`);

//Find images for types
const normal = fs.readFileSync(`${__dirname}/../client/Types/normal.webp`);
const fighting = fs.readFileSync(`${__dirname}/../client/Types/fighting.webp`);
const flying = fs.readFileSync(`${__dirname}/../client/Types/flying.webp`);
const poison = fs.readFileSync(`${__dirname}/../client/Types/poison.webp`);
const ground = fs.readFileSync(`${__dirname}/../client/Types/ground.webp`);
const rock = fs.readFileSync(`${__dirname}/../client/Types/rock.webp`);
const bug = fs.readFileSync(`${__dirname}/../client/Types/bug.webp`);
const ghost = fs.readFileSync(`${__dirname}/../client/Types/ghost.webp`);
const steel = fs.readFileSync(`${__dirname}/../client/Types/steel.webp`);
const fire = fs.readFileSync(`${__dirname}/../client/Types/fire.webp`);
const water = fs.readFileSync(`${__dirname}/../client/Types/water.webp`);
const grass = fs.readFileSync(`${__dirname}/../client/Types/grass.webp`);
const electric = fs.readFileSync(`${__dirname}/../client/Types/electric.webp`);
const psychic = fs.readFileSync(`${__dirname}/../client/Types/psychic.webp`);
const ice = fs.readFileSync(`${__dirname}/../client/Types/ice.webp`);
const dragon = fs.readFileSync(`${__dirname}/../client/Types/dragon.webp`);
const dark = fs.readFileSync(`${__dirname}/../client/Types/dark.webp`);
const fairy = fs.readFileSync(`${__dirname}/../client/Types/fairy.webp`);

//List of possible types
const types = 
{
    normal,
    fighting,
    flying,
    poison,
    ground,
    rock,
    bug,
    ghost,
    steel,
    fire,
    water,
    grass,
    electric,
    psychic,
    ice,
    dragon,
    dark,
    fairy
};

//Get types then send image related to type
const getType = (request, response, type) => {
    if(types[type])
    //If the type exists, send related image
    {
        response.writeHead(200, { 'Content-Type': 'image/webp' });
        response.write(types[type]);
    }
    else
    //Else send 404 not found error
    {
        const responseJSON = {
            message: 'No such type exists',
            id: 'notFound',
        };

        const headers = {
            'Content-Type': 'application/json',
        };

        response.writeHead(404, headers);
        response.write(JSON.stringify(responseJSON));
    }
    response.end();
};

//Send requested background image
const getBackground = (request, response, type) => {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.write(background);
    response.end();
};

module.exports = {
    getType,
    getBackground,
};