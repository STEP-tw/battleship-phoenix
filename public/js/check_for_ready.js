const addListener = function() {
  let readyButton = utils.getReadyButton();
  readyButton.onclick = handleReady;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 5;
};

const handleReady=function(){
  if (areAllShipsPlaced()) {
    document.getElementsByClassName('shipsBlock')[0].style.display='none';
    loadFleet();
    utils.getReadyButton().style.display = 'none';
    utils.poll(utils.get(),'/arePlayersReady',handleStartGame);
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
};

const loadFleet = function() {
  let fleet = utils.toS({fleetDetails : shipsHeadPositions});
  sendAjax(utils.post(),'/start-game',null,fleet);
};

const handleTurn = function (myTurn) {
  let message = myTurn ? 'My turn' : 'Opponent\'s turn';
  utils.updateMessage(message);
  if (myTurn) {
    utils.clearIntervals();
    makeTargetGridFirable();
  }else {
    deactivateTargetGrid();
    utils.clearIntervals();
    sendAjax(utils.get(),'/hasOpponentWon',displayLost);
  }
};

const updateSankShips = function(fleet){
  let shipsSunk = document.querySelectorAll('.fleetDetails tr td');
  for (let index = 0; index < fleet; index++) {
    shipsSunk[index].style.backgroundColor = 'rgba(255, 34, 34, 0.33)';
    shipsSunk[index].style.border = '0.5px solid rgb(107, 32, 32)';
  }
};

const displayLost = function(){
  let response = utils.getResponse(this);
  updateSankShips(response.destroyedShips);
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
  console.log(response);
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
  cell.style["background-color"]="rgba(177, 177, 177, 0.63)";
};

const remCellHighlight = function(event){
  let cellId = event.target.id;
  document.getElementById(cellId).style["background-color"]=null;
};

const dontAllowRefire = function(cell){
  if(cell.style.backgroundImage){
    cell.style.cursor='not-allowed';
  }
};

const makeTargetGridFirable = function(){
  let targetGridCells = document.querySelectorAll('[id^="tg"]');
  targetGridCells.forEach((targetGridCell)=>{
    targetGridCell.style.cursor = 'url("/assets/images/target.png"),auto';
    dontAllowRefire(targetGridCell);
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
    document.querySelector('.victory').style.display = "block";
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

const displayShot = function() {
  if(this.responseText.statusCode== 406) {
    return;
  }
  let shotResult = utils.getResponse(this);
  let winStatus = shotResult.winStatus;
  let cell = document.getElementById(generateCellId('tg',shotResult.firedPos));
  if(!shotResult.status) {
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  } else {
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
    reduceOpponentHealth();
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
