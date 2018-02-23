const addListener = function() {
  let readyButton = utils.getReadyButton();
  readyButton.onclick = handleReady;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 5;
};

const handleReady=function(){
  if (areAllShipsPlaced()) {
    loadFleet();
    utils.getReadyButton().style.display = 'none';
    utils.poll(utils.get(),'/arePlayersReady',handleStartGame);
  }else {
    utils.updateMessage("Please place all your ships");
  }
};

const loadFleet = function() {
  let fleetDetails = `fleetDetails=${utils.toS(shipsHeadPositions)}`;
  sendReq(utils.post(),'/start-game',null,fleetDetails);
};

const handleTurn = function (myTurn) {
  let message = myTurn ? 'My turn' : 'Opponent\'s turn';
  utils.updateMessage(message);
};

const displayLost = function(){
  let response = JSON.parse(this.responseText);
  if(response.status){
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    document.querySelector('.defeat').style.display = "block";
  }
};

const gameStarts = function (response) {
  let myTurn = response.myTurn;
  let targetGrid = utils.getTargetGrid();
  utils.updateMessage("Game Started");
  handleTurn(myTurn);
  utils.clearIntervals();
  utils.poll(utils.get(),'/hasOpponentWon',displayLost);
  if(myTurn){
    makeTargetGridFirable(myTurn);
    targetGrid.onclick = checkAndDisplayShot;
    targetGrid.setAttribute('class','tg');
  }
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

const makeTargetGridFirable = function(myTurn){
  let targetGridCells = document.querySelectorAll('[id^="tg"]');
  targetGridCells.forEach((targetGridCell)=>{
    targetGridCell.onmouseover = highlightCell;
    targetGridCell.onmouseout = remCellHighlight;
  });
};

const showWaitingMessage = function() {
  let message = "Waiting for opponent to place ships";
  utils.updateMessage(message);
};

const handleStartGame = function () {
  let response = utils.parse(this.responseText);
  response.status ? gameStarts(response) : showWaitingMessage();
};

const displayWon=function(){
  let response = JSON.parse(this.responseText);
  if(response.status){
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    document.querySelector('.victory').style.display = "block";
  }
};

const displayShot = function() {
  let shotResult = utils.parse(this.responseText);
  let cell = document.getElementById(generateCellId('tg',shotResult.firedPos));
  if(!shotResult.status) {
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  } else {
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
    sendReq("GET","/hasOpponentLost",displayWon);
  }
};

const checkAndDisplayShot=function(event) {
  let firedPosition=parseCoordinates(event.target.id);
  let data = {firedPosition:firedPosition};
  data = utils.toS(data);
  sendJsonData(utils.post(),"/isHit",displayShot,data);
};
