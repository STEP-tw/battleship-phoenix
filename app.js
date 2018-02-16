const express = require('express');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const gameHandlerPath = "./src/handlers/create_game_handler";
const createGame = require(gameHandlerPath).createGame;
const hasOpponentJoined = require(gameHandlerPath).hasOpponentJoined;
let app = express();

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
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.cookies)
  ].join(' ');
}, {
  stream: logStream
}));

app.get('/hasOpponentJoined',(req,res)=>hasOpponentJoined(req,res));
app.get('/createGame',createGame);
app.use(express.static('public'));

module.exports = app;
