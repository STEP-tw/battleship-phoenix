const addListener = function() {
  let readyButton = utils.getReadyButton();
  readyButton.onclick = handleReady;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 1;
};

const handleReady=function(){
  if (areAllShipsPlaced()) {
    document.getElementsByClassName('shipsBlock')[0].style.display='none';
    loadFleet();
    utils.getReadyButton().style.display = 'none';
    utils.poll(utils.get(),'/arePlayersReady',handleStartGame);
    disableOceanGrid();
  } else {
    utils.updateMessage("Please place all your ships");
  }
};

const handleStartGame = function () {
  let response = utils.getResponse(this);
  response.status ? gameStarts(response) : showWaitingMessage();
};

const gameStarts = function (response) {
  utils.clearIntervals();
  let myTurn = response.myTurn;
  let targetGrid = utils.getTargetGrid();
  utils.updateMessage("Game Started");
  handleTurn(myTurn);
  dontAllowHover('og',myTurn);

  document.querySelectorAll('.healthBlock').forEach((elem)=>{
    elem.style.display = 'block';
  });
  document.querySelector('#targetGridBox').style.display = 'block';
  document.querySelector('.enemyFleet').style.display = 'block';
};

const loadFleet = function() {
  let fleet = utils.toS({fleetDetails : shipsHeadPositions});
  sendAjax(utils.post(),'/start-game',null,fleet);
};

const handleTurn = function (myTurn) {
  let message = myTurn ? 'Your turn' : 'Opponent\'s turn';
  utils.updateMessage(message);
  if (myTurn) {
    utils.clearIntervals();
    makeTargetGridFirable();
  }else {
    deactivateTargetGrid();
    utils.clearIntervals();
    setTimeout(()=>{
      sendAjax(utils.get(),'/hasOpponentWon',displayLost);
    },1000);
  }
};

const getCellIds = function(shipCoords){
  return shipCoords.map((coord)=>{
    let cellId = generateCellId('tg',coord);
    return cellId;
  });
};

const highlightSunkShips = function(sunkShipsCellIds){
  sunkShipsCellIds.forEach((sunkShipCellIds)=>{
    sunkShipCellIds.forEach((cellId)=>{
      let cell = document.querySelector(`#${cellId}`);
      cell.style.backgroundColor = 'rgba(71, 141, 134, 0.11)';
    });
  });
};

const updateSankShips = function(shipCount,sunkShipsCoords){
  let shipsSunk = document.querySelectorAll('.fleetDetails tr td');
  for (let index = 0; index < shipCount; index++) {
    shipsSunk[index].style.backgroundColor = 'rgba(255, 34, 34, 0.52)';
    shipsSunk[index].style.border = '0.5px solid rgb(107, 32, 32)';
  }
  if(sunkShipsCoords && sunkShipsCoords.length>0){
    let sunkShipsCellIds = sunkShipsCoords.map(getCellIds);
    highlightSunkShips(sunkShipsCellIds);
  }
};

const displayLost = function(){
  let response = utils.getResponse(this);
  updateOceanGrid(response);
  updatePlayerDetails(response);
  if(response.status){
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    setTimeout(()=>{
      document.querySelector('.defeat').style.display = "block";
    },500);
    return;
  }
  handleTurn(response.myTurn);
};

const deactivateTargetGrid = function () {
  let targetGrid = utils.getTargetGrid();
  targetGrid.onclick = null;
  dontAllowHover('tg');
};

const dontAllowHover = function(gridId,myTurn){
  let targetGridCells = document.querySelectorAll(`[id^="${gridId}"]`);
  targetGridCells.forEach((cell)=>{
    cell.onmouseover = function(event){
      document.querySelector(`#${event.target.id}`).style.cursor='not-allowed';
    };
  });
  document.getElementsByClassName('shipsBlock')[0].style.display='none';
};

const updateOceanGrid = function(response){
  let opponentShots = response.opponentShots;
  opponentShots.hits.forEach((hitCoord)=>{
    let cellId = generateCellId('og',hitCoord);
    let cell = document.getElementById(cellId);
    let imageUrl = cell.style.backgroundImage;
    cell.style.backgroundImage = getShipPartUrl(imageUrl);
  });
  opponentShots.misses.forEach((missCoord)=>{
    let cellId = generateCellId('og',missCoord);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  });
};

const highlightCell = function(event){
  let cellId = event.target.id;
  let cell = document.getElementById(cellId);
  if(cell.style.backgroundImage){
    cell.style.cursor='not-allowed';
  } else {
    cell.style.backgroundImage='url("/assets/images/target.png")';
  }
};

const remCellHighlight = function(event){
  let cellId = event.target.id;
  let cell = document.getElementById(cellId);
  let expected = 'url("/assets/images/target.png")';
  if(cell.style.backgroundImage==expected) {
    cell.style.backgroundImage=null;
  }
};

const makeTargetGridFirable = function(){
  let targetGridCells = document.querySelectorAll('[id^="tg"]');
  targetGridCells.forEach((targetGridCell)=>{
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

const displayWon=function(hasWon){
  if(hasWon){
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    setTimeout(()=>{
      document.querySelector('.victory').style.display = "block";
    },500);
  }
};

const checkAndDisplayShot=function(event) {
  let firedPosition=parseCoordinates(event.target.id);
  let data = {firedPosition:firedPosition};
  data = utils.toS(data);
  sendAjax(utils.post(),"/updateFiredShot",displayShot,data);
};

const reduceOpponentHealth = function(){
  let enemyHealth = document.querySelector('#enemyHealth');
  if(enemyHealth.value <= 10 && enemyHealth.value > 5){
    enemyHealth.setAttribute('class','mediumHealth');
  }
  if(enemyHealth.value <= 5){
    enemyHealth.setAttribute('class','lowHealth');
  }
  enemyHealth.value--;
};

const playMissSound = function(){
  let audio = new Audio('../assets/audio/miss.mp3');
  audio.play();
};

const playHitSound = function(){
  let audio = new Audio('../assets/audio/hit.mp3');
  audio.play();
};

const displayShot = function() {
  if(this.responseText.isAlreadyFired) {
    return;
  }
  let winStatus = shotResult.winStatus;
  let cell = document.getElementById(generateCellId('tg',shotResult.firedPos));
  let destroyedShipsCount = shotResult.destroyedShipsCoords.length;
  let destroyedShipsCoords = shotResult.destroyedShipsCoords;
  if(!shotResult.status) {
    playMissSound();
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  } else {
    playHitSound();
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
    reduceOpponentHealth();
    updateSankShips(destroyedShipsCount,destroyedShipsCoords);
    displayWon(winStatus);
  }
  if(!winStatus){
    handleTurn(shotResult.myTurn);
  }
};

const updatePlayerDetails = function(response) {
  let opponentShots = response.opponentShots;
  let hits = opponentShots.hits.length;
  let health = 17-hits;
  let myHealth = document.querySelector('#myHealth');
  if(health<=10 && health > 5){
    myHealth.setAttribute('class','mediumHealth');
  }
  if(health<=5){
    myHealth.setAttribute('class','lowHealth');
  }
  myHealth.value = health;
};

const isPlayerWillingToLeave = function(){
  return document.getElementById('quit').style.display == 'block';
};

const displayOpponentLeft = function(status) {
  if (status.hasOpponentLeft) {
    document.getElementById('opponentLeft').style.display = 'block';
    return;
  }
  hasOpponentLeft();
};

const handleStatus = function() {
  let status = JSON.parse(this.responseText);
  if(isPlayerWillingToLeave()||this.responseText=='{}'){
    return;
  }
  displayOpponentLeft(status);
};

const hasOpponentLeft = function() {
  setTimeout(()=>{
    sendAjax(utils.get(),'/hasOpponentLeft',handleStatus);
  },1000);
};
