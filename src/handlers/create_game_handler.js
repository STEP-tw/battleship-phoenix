const Game = require('../models/game');

const createGame = function(games) {
  if (games.length==0) {
    let game = new Game();
    game.addPlayer();
    games.push(game);
    return;
  }
};


const hasOpponentJoined = function(req,res,games) {
  res.send(`${games[0].hasTwoPlayers()}`);
};

exports.createGame = createGame;
exports.hasOpponentJoined = hasOpponentJoined;
