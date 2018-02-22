const express = require('express');
const cookieParser = require("cookie-parser");
const logRequest = require('./src/utils/logRequest').logRequest;
const bodyParser = require("body-parser");
const fs = require("fs");
let path = './src/handlers/pos_sys_router';
const servePosSysRoute = require(path).servePosSysRoute;
const hostOrJoin = require("./src/handlers/host_or_join").hostOrJoin;
const gameHandlerPath = "./src/handlers/handlers.js";
const handlers = require(gameHandlerPath);
let app = express();
app.fs = fs;

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(logRequest);

app.get('/hasOpponentJoined',handlers.hasOpponentJoined);
app.get('/arePlayersReady',handlers.arePlayersReady);
app.get('/create-game',handlers.createGame);
app.get('/cancel-game',handlers.cancelGame);
app.get('/positionSystem',servePosSysRoute);
app.get('/host_or_join',hostOrJoin);
app.get('/hasOpponentLost',handlers.hasOpponentLost);
app.get('/hasOpponentWon',handlers.hasOpponentWon);

app.post('/isHit',handlers.isHit);
app.post('/start-game',handlers.loadFleet);
app.post('/login',handlers.createGame);

module.exports = app;
