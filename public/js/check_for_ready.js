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
  utils.updateMessage("Game Started");
  utils.getTargetGrid().onclick = checkAndDisplayShot;
  handleTurn(response.myTurn);
  utils.clearIntervals();
  utils.poll(utils.get(),'/hasOpponentWon',displayLost);
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
