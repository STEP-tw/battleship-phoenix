const express = require('express');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
let path = './src/handlers/pos_sys_router';
const servePosSysRoute = require(path).servePosSysRoute;
const gameHandlerPath = "./src/handlers/handlers.js";
const handlers = require(gameHandlerPath);
let app = express();
app.fs = fs;

let logStream = fs.createWriteStream("./log/request.log",{flags:"a"});

app.use(cookieParser());
app.use(express.urlencoded({
  extended: false
}));
app.use(morgan(handlers.logRequest, {
  stream: logStream
}));

app.use(express.json());
app.use(express.static('public'));
app.post('/isHit',handlers.isHit);
app.get('/hasOpponentJoined',handlers.hasOpponentJoined);
app.get('/arePlayersReady',handlers.arePlayersReady);
app.post('/start-game',handlers.loadFleet);
app.get('/create-game',handlers.createGame);
app.get('/cancel-game',handlers.cancelGame);
app.get('/positionSystem',servePosSysRoute);
app.post('/login',handlers.createGame);

module.exports = app;
