const addListener = function() {
  let readyButton = utils.getReadyButton();
  readyButton.onclick = handleReady;
};

const handleReady = function() {
  document.getElementById("leaveGame").style.display ='none';
  loadFleet();
};

const showOpponentLeft = function(){
  utils.clearIntervals();
  document.querySelector('#rivalLeft').style.display='block';
};

const handleStartGame = function() {
  let response = utils.getResponse(this);
  if(response.hasOpponentLeft) {
    return showOpponentLeft();
  }
  response.status ? gameStarts(response) : showWaitingMessage();
};

const gameStarts = function(response) {
  utils.clearIntervals();
  let myTurn = response.myTurn;
  let targetGrid = utils.getTargetGrid();
  utils.updateMessage("Game Started");
  document.getElementById("quitGame").style.display = 'block';
  handleTurn(myTurn);
  dontAllowHover('og');
  viewFleetAndPlayerDetails();
};

const viewFleetAndPlayerDetails = function(){
  document.querySelectorAll('.healthBlock').forEach((elem) => {
    elem.style.display = 'block';
  });
  document.querySelector('#targetGridBox').style.display = 'block';
  document.querySelector('.enemyFleet').style.display = 'block';
};
const checkFleetStatus=function(){
  let response=utils.getResponse(this);
  if (response.status) {
    document.querySelector('.shipsBlock').style.display = 'none';
    utils.getReadyButton().style.display = 'none';
    utils.poll(utils.get(), '/arePlayersReady', handleStartGame);
    disableOceanGrid();
    return;
  }
  utils.updateMessage('Invalid fleet position');
};
const loadFleet = function() {
  let fleet = utils.toS({
    fleetDetails: shipsHeadPositions
  });
  utils.sendAjax(utils.post(), '/start-game', checkFleetStatus, fleet);
};

const handleTurn = function(myTurn) {
  utils.clearIntervals();
  if (myTurn) {
    utils.updateMessage('Your turn');
    makeTargetGridFirable();
  } else {
    utils.updateMessage('Opponent\'s turn');
    utils.clearIntervals();
    deactivateTargetGrid();
    setTimeout(()=>{
      utils.sendAjax(utils.get(),'/statusDuringOpponentTurn',displayLost);
    },1000);
  }
};

const getCellIds = function(shipCoords) {
  return shipCoords.map((coord) => {
    let cellId = generateCellId('tg', coord);
    return cellId;
  });
};

const highlightSunkShips = function(sunkShipsCellIds) {
  sunkShipsCellIds.forEach((sunkShipCellIds) => {
    sunkShipCellIds.forEach((cellId) => {
      let cell = document.querySelector(`#${cellId}`);
      cell.style.backgroundColor = 'rgba(71, 141, 134, 0.11)';
    });
  });
};

const updateSankShips = function(shipsCount, sunkShipsCoords) {
  let shipsSunk = document.querySelectorAll('.fleetDetails tr td');
  for (let index = 0; index < shipsCount; index++) {
    shipsSunk[index].style.backgroundColor = 'rgba(255, 34, 34, 0.52)';
    shipsSunk[index].style.border = '0.5px solid rgb(107, 32, 32)';
  }
  if (sunkShipsCoords && sunkShipsCoords.length > 0) {
    let sunkShipsCellIds = sunkShipsCoords.map(getCellIds);
    highlightSunkShips(sunkShipsCellIds);
  }
};

const displayLost = function() {
  let response = utils.getResponse(this);
  if (response.hasOpponentLeft) {
    return displayOpponentLeft();
  }
  playHitOrMissSound(response);
  updateOceanGrid(response);
  if(response.status){
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    setTimeout(() => {
      document.querySelector('.defeat').style.display = "block";
    }, 500);
    return;
  }
  handleTurn(response.myTurn);
};

const deactivateTargetGrid = function() {
  let targetGrid = utils.getTargetGrid();
  targetGrid.onclick = null;
  dontAllowHover('tg');
};

const dontAllowHover = function(gridId, myTurn) {
  let targetGridCells = document.querySelectorAll(`[id^="${gridId}"]`);
  targetGridCells.forEach((cell) => {
    cell.onmouseover = function(event) {
      document.querySelector(`#${event.target.id}`).style.cursor
      = 'not-allowed';
    };
  });
};

const updateCellOfOceanGrid = function(coord,type) {
  let cellId = generateCellId('og', coord);
  let cell = document.getElementById(cellId);
  let imageUrl = cell.style.backgroundImage;
  cell.style.backgroundImage = getShipPartUrl(type,imageUrl);
};

const updateShotsOnOceanGrid = function(hitPositions,type){
  hitPositions.forEach((coord) => {
    updateCellOfOceanGrid(coord,type);
  });
};

const updateOceanGrid = function(response){
  if ("lastShot" in response) {
    let firedPos = response.lastShot.shot;
    if (response.lastShot.status) {
      updateCellOfOceanGrid(firedPos,'hits');
      updatePlayerDetails();
      return;
    }
    updateCellOfOceanGrid(firedPos,'misses');
  }
};

const highlightCell = function(event) {
  let cellId = event.target.id;
  let cell = document.getElementById(cellId);
  if (cell.style.backgroundImage) {
    cell.style.cursor = 'not-allowed';
  } else {
    cell.style.backgroundImage = 'url("/assets/images/target.png")';
  }
};

const remCellHighlight = function(event) {
  let cellId = event.target.id;
  let cell = document.getElementById(cellId);
  let expected = 'url("/assets/images/target.png")';
  if (cell.style.backgroundImage == expected) {
    cell.style.backgroundImage = null;
  }
};

const makeTargetGridFirable = function() {
  let targetGridCells = document.querySelectorAll('[id^="tg"]');
  targetGridCells.forEach((targetGridCell) => {
    targetGridCell.style.cursor = 'none';
    targetGridCell.onmouseover = highlightCell;
    targetGridCell.onmouseout = remCellHighlight;
  });
  let targetGrid = utils.getTargetGrid();
  targetGrid.onclick = checkAndDisplayShot;
};

const showWaitingMessage = function() {
  let message = "Waiting for opponent to place ships";
  utils.updateMessage(message);
};

const displayWon = function(hasWon) {
  if (hasWon) {
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    setTimeout(() => {
      document.querySelector('.victory').style.display = "block";
    }, 500);
  }
};

const checkAndDisplayShot = function(event) {
  if (event.target.id.startsWith('tg')) {
    let firedPosition = parseCoordinates(event.target.id);
    let data = utils.toS({firedPosition: firedPosition});
    utils.sendAjax(utils.post(), "/updateFiredShot", displayShot, data);
  }
};

const reduceOpponentHealth = function() {
  let enemyHealth = document.querySelector('#enemyHealth');
  if (enemyHealth.value <= 10 && enemyHealth.value > 5) {
    enemyHealth.setAttribute('class', 'mediumHealth');
  }
  if (enemyHealth.value <= 5) {
    enemyHealth.setAttribute('class', 'lowHealth');
  }
  enemyHealth.value--;
};

const playMissSound = function(status) {
  let audio = new Audio('../assets/audio/miss.mp3');
  status && audio.play();
};

const playHitSound = function(status) {
  let audio = new Audio('../assets/audio/hit.mp3');
  status && audio.play();
};

const displayShot = function() {
  let shotResult = utils.getResponse(this);
  if (shotResult.hasOpponentLeft) {
    return displayOpponentLeft();
  }
  if(shotResult.illegalTurn){
    utils.updateMessage('Not your turn');
    return;
  }
  if (shotResult.isAlreadyFired) {
    return;
  }

  let winStatus = shotResult.winStatus;
  let cell = document.getElementById(generateCellId('tg', shotResult.firedPos));
  let destroyedShipsCount = shotResult.destroyedShipsCoords.length;
  let destroyedShipsCoords = shotResult.destroyedShipsCoords;
  let soundStatus = utils.parse(shotResult.sound);
  if (!shotResult.status) {
    playMissSound(soundStatus);
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  } else {
    playHitSound(soundStatus);
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
    reduceOpponentHealth();
    updateSankShips(destroyedShipsCount, destroyedShipsCoords);
    displayWon(winStatus);
  }
  if (!winStatus) {
    handleTurn(shotResult.myTurn);
  }
};

const updatePlayerDetails = function() {
  let myHealth = document.querySelector('#myHealth');
  let health = myHealth.value- 1;
  if(health<=10 && health > 5){
    myHealth.setAttribute('class','mediumHealth');
  }
  if (health <= 5) {
    myHealth.setAttribute('class', 'lowHealth');
  }
  myHealth.value = health;
};

const isPlayerWillingToLeave = function() {
  return document.getElementById('quit').style.display == 'block';
};

const playHitOrMissSound = function (response) {
  let sound = response.sound;
  if ('lastShot' in response) {
    response.lastShot.status ? playHitSound(sound) : playMissSound(sound);
  }
};

const displayOpponentLeft = function() {
  document.getElementById('opponentLeft').style.display = 'block';
};
