const express = require('express');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
let path = './src/handlers/pos_sys_router';
const servePosSysRoute = require(path).servePosSysRoute;
const gameHandlerPath = "./src/handlers/create_game_handler";
const createGame = require(gameHandlerPath).createGame;
const startGame = require("./src/handlers/start_game_handler").startGame;
const loadFleet = require("./src/handlers/start_game_handler").loadFleet;
const cancelGame = require("./src/handlers/cancel_game_handler").cancelGame;
const hasOpponentJoined = require(gameHandlerPath).hasOpponentJoined;
const turnHandler = require(gameHandlerPath).turnHandler;
let app = express();
app.fs = fs;

let logStream = fs.createWriteStream("./log/request.log",{flags:"a"});

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), `-`,
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.cookies)
  ].join(' ');
}, {
  stream: logStream
}));
app.use(express.static('public'));
app.get('/hasOpponentJoined',(req,res)=>hasOpponentJoined(req,res));
app.get('/start-game',startGame);
app.post('/start-game',loadFleet);
app.get('/create-game',createGame);
app.get('/cancel-game',cancelGame);
app.get('/positionSystem',servePosSysRoute);
app.get('/getTurn',turnHandler);


module.exports = app;
