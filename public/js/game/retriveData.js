const displayShip = function(ship) {
  drawShip(ship.initialPos, ship.direction, ship.length);
  updateShotsOnOceanGrid(ship.posOfDamage, 'hits');
};

const updateShotsOnTargetGrid = function(shots, type, url) {
  shots[type].forEach((hit) => {
    let cellId = generateCellId('tg', hit);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = url;
  });
};

const displayPlayersName = function(response) {
  let playerName = response.playerName;
  let opponentName = response.enemyName;
  let playerDetails = document.querySelector('#playername');
  let enemyDetails = document.querySelector('#enemyName');
  playerDetails.innerText = playerName;
  enemyDetails.innerText = opponentName;
};


const updateDisplay = function() {
  let response = utils.getResponse(this);
  let fleet = response.fleet;
  let destroyedShipsCoords = response.destroyedShipsCoords;
  let destroyedShipsCount = destroyedShipsCoords.length;
  displayPlayersName(response);
  updateHealth(response.opponentHits);
  updateHealth(response.playerShots.hits, '.enemyHealth');
  updateSankShips(destroyedShipsCount, destroyedShipsCoords);
  if (fleet && fleet.length != 0) {
    document.getElementsByClassName('shipsBlock')[0].style.display = 'none';
    document.getElementsByClassName('buttonBlock')[0].style.display = 'none';
    utils.sendAjax(utils.get(), '/arePlayersReady', handleStartGame);
  }
  fleet.map(displayShip);
  updateShotsOnTargetGrid(response.playerShots, 'hits'
    , "url('../assets/images/hit.png')");
  updateShotsOnTargetGrid(response.playerShots, 'misses'
    , "url('../assets/images/miss.png')");
  updateShotsOnOceanGrid(response.opponentMisses, 'misses');
};

const getAndUpdateGameStatus = function() {
  utils.sendAjax(utils.get(), '/gameStatus', updateDisplay);
};
