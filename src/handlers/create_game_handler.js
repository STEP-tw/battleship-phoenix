const Game = require('../models/game');

const createGame = function(req, res, games) {
  let game = new Game();
  games.push(game);
  game.addPlayer();
  res.send('Welcome you are the first player');
};
exports.createGame = createGame;
