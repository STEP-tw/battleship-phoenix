const express = require('express');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const Game = require('./src/models/game.js');
let app = express();

app.playerCount = 0;
let logStream = fs.createWriteStream("./log/request.log",{flags:"a"});
let games = [];

const createGame = function(req, res) {
  let game = new Game();
  games.push(game);
  game.addPlayer();
  res.send('Welcome you are the first player');
};

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

app.use(express.static('./public'));

app.get("/hasOpponentPlayer",function(req,res) {
  if (app.playerCount==2) {
    res.send("true");
    return;
  }
  res.send("false");
});

app.use(express.static('public'));


app.get('/create-game', createGame);
module.exports = app;
