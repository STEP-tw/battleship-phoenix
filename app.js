const fs = require("fs");
const express = require('express');
const cookieParser = require("cookie-parser");
const validator = require("express-validator");

const path = './src/handlers/pos_sys_router';
const gameHandlerPath = "./src/handlers/handlers.js";

const servePosSysRoute = require(path).servePosSysRoute;
const handlers = require(gameHandlerPath);
const generateSessionId = require('./src/utils/time.js').generateSessionId;
const logRequest = require('./src/utils/logRequest').logRequest;
const GamesHandler = require('./src/models/gamesHandler.js');

let app = express();
app.fs = fs;
app.generateSessionId = generateSessionId;
app.gamesHandler = new GamesHandler();

app.use(cookieParser());
app.use(express.json());
app.use(validator());

app.use(logRequest);

app.use(handlers.handleTresspassing);
app.get('/arePlayersReady',handlers.arePlayersReady);
app.get('/hasOpponentJoined',handlers.hasOpponentJoined);
app.get('/cancel-game',handlers.cancelGame);
app.get('/positionSystem',servePosSysRoute);
app.get('/hasOpponentWon',handlers.hasOpponentWon);
app.get('/gameStatus',handlers.getGameStatus);
// app.get('/quit',handlers.quitGame);
// app.get('/hasOpponentLeft',handlers.hasOpponentLeft);
app.get('/getHostedGames',handlers.getHostedGames);

app.post('/updateFiredShot',handlers.isAlreadyFired,handlers.updateShot);
app.post('/start-game',handlers.loadFleet);
app.post('/host',handlers.hostGame);
app.post('/join',handlers.joinGame);

app.use(express.static('public'));

module.exports = app;
