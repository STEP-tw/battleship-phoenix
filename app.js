const express = require('express');
const cookieParser = require("cookie-parser");
const logRequest = require('./logRequest').logRequest;
const bodyParser = require("body-parser");
const fs = require("fs");
let path = './src/handlers/pos_sys_router';
let startGameHandlerPath = "./src/handlers/start_game_handler";
const servePosSysRoute = require(path).servePosSysRoute;
const gameHandlerPath = "./src/handlers/create_game_handler";
const createGame = require(gameHandlerPath).createGame;
const startGame = require(startGameHandlerPath).startGame;
const loadFleet = require(startGameHandlerPath).loadFleet;
const cancelGame = require("./src/handlers/cancel_game_handler").cancelGame;
const arePlayersReady = require(startGameHandlerPath).arePlayersReady;
const hasOpponentJoined = require(gameHandlerPath).hasOpponentJoined;
const turnHandler = require(gameHandlerPath).turnHandler;
let app = express();
app.fs = fs;

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(logRequest);

app.use(express.static('public'));


app.get('/hasOpponentJoined',hasOpponentJoined);
app.get('/arePlayersReady',arePlayersReady);
app.get('/start-game',startGame);
app.post('/start-game',loadFleet);
app.get('/create-game',createGame);
app.get('/cancel-game',cancelGame);
app.get('/positionSystem',servePosSysRoute);
app.get('/getTurn',turnHandler);
app.post('/login',createGame);

module.exports = app;
