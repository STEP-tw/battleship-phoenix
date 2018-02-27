const areEqual = function(first, second) {
  for (let index = 0; index < first.length; index++) {
    if (first[index] != second[index]) {
      return false;
    }
  }
  return first.length == second.length;
};

const includes = function(array, item) {
  return array.some((element) => {
    return areEqual(element, item);
  });
};

const displayHead = function(head, damagedPositions) {
  let headCell = document.getElementById(generateCellId('og', head));
  if (!includes(damagedPositions, head)) {
    headCell.style.backgroundImage = "url('../assets/images/head.png')";
  } else {
    headCell.style.backgroundImage = "url('../assets/images/headHit.png')";
  }
};

const displayTail = function(tail, damagedPositions) {
  let tailCell = document.getElementById(generateCellId('og', tail));
  if (!includes(damagedPositions, tail)) {
    tailCell.style.backgroundImage = "url('../assets/images/tail.png')";
  } else {
    tailCell.style.backgroundImage = "url('../assets/images/tailHit.png')";
  }
};

const displayBody = function(shipCoords, damagedPositions) {
  for (let index = 1; index < shipCoords.length - 1; index++) {
    let generatedCell = generateCellId('og', shipCoords[index]);
    let bodyCell = document.getElementById(generatedCell);
    if (!includes(damagedPositions, shipCoords[index])) {
      bodyCell.style.backgroundImage = "url('../assets/images/body.png')";
    } else {
      bodyCell.style.backgroundImage = "url('../assets/images/bodyHit.png')";
    }
  }
};

const displayShip = function(ship) {
  let shipCoords = getCoordinates(ship.direction, ship.initialPos, ship.length);
  let head = shipCoords[0];
  let tail = shipCoords[shipCoords.length - 1];
  let damagedPositions = ship.posOfDamage;
  displayHead(head, damagedPositions);
  displayTail(tail, damagedPositions);
  displayBody(shipCoords, damagedPositions);
};

const updateShotsOnTargetGrid = function(shots){
  shots.hits.forEach((hit)=>{
    let cellId = generateCellId('tg',hit);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
  });
  shots.misses.forEach((miss)=>{
    let cellId = generateCellId('tg',miss);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  });
};

const updateMissesOnOceanGrid = function(misses){
  misses.forEach((missCoord)=>{
    let cellId = generateCellId('og',missCoord);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  });
};

const displayPlayersName = function(response){
  let playerName = response.playerName;
  let opponentName = response.enemyName;
  let playerDetails = document.querySelector('#playername');
  let enemyDetails = document.querySelector('#enemyName');
  playerDetails.innerText = playerName;
  enemyDetails.innerText = opponentName;
};

const updateHealths = function(response){
  let myHealth = document.querySelector('#myHealth');
  myHealth.value = 17 - response.opponentHits.length;
  if(myHealth.value<=10 && myHealth.value>10){
    myHealth.setAttribute('class','mediumHealth');
  }
  if(myHealth.value<=5){
    myHealth.setAttribute('class','lowHealth');
  }
  let enemyHealth = document.querySelector('.enemyHealth');
  enemyHealth.value = 17-(response.playerShots.hits.length);
  if(enemyHealth.value <= 10 && enemyHealth.value > 10){
    enemyHealth.setAttribute('class','mediumHealth');
  }
  if(enemyHealth.value <= 5){
    enemyHealth.setAttribute('class','lowHealth');
  }
};

const updateDisplay = function() {
  let response = utils.getResponse(this);
  let fleet = response.fleet;
  displayPlayersName(response);
  updateHealths(response);
  updateSankShips(response.destroyedShips);
  if (fleet) {
    if (fleet.length != 0) {
      document.getElementsByClassName('shipsBlock')[0].style.display = 'none';
      document.getElementsByClassName('buttonBlock')[0].style.display = 'none';
      sendAjax(utils.get(), '/arePlayersReady', handleStartGame);
    }
  }
  let hits = response.playerShots.hits.length;
  fleet.map(displayShip);
  updateShotsOnTargetGrid(response.playerShots);
  updateMissesOnOceanGrid(response.opponentMisses);
};

const getAndUpdateGameStatus = function() {
  sendAjax(utils.get(), '/gameStatus', updateDisplay);
};
