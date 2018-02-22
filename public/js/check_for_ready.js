const addListener = function() {
  let readyButton = document.getElementById('ready');
  readyButton.onclick = startGamePlay;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 5;
};

const startGamePlay=function(){
  if (areAllShipsPlaced()) {
    loadFleet();
    document.getElementById('ready').style.display = 'none';
    utils.poll(utils.get(),'/arePlayersReady',showWaitingMessage);
    return;
  }
  utils.updateMessage("Please place all your ships");
};

const loadFleet = function() {
  let fleetDetails = `fleetDetails=${utils.toS(shipsHeadPositions)}`;
  sendReq(utils.post(),'/start-game',null,fleetDetails);
};

const handleTurn = function (myTurn) {
  console.log(typeof(myTurn));
  let message = myTurn ? 'My turn' : 'Opponent\'s turn';
  utils.updateMessage(message);
};

const showWaitingMessage = function() {
  let response = utils.parse(this.responseText);
  let message = "Waiting for opponent to place ships";
  utils.updateMessage(message);
  if (response.status) {
    utils.updateMessage("Game Started");
    document.querySelector('#targetGrid').onclick = checkAndDisplayShot;
    handleTurn(response.myTurn);
    clearInterval(interval);
    return;
  }
};

const askIsOpponentReady = function() {
  sendReq(utils.get(),'/arePlayersReady',showWaitingMessage);
};

window.onbeforeunload = ()=>{
  return 'do you want to reload this page?';
};

const displayShot = function() {
  let shotResult = utils.parse(this.responseText);
  let cell = document.getElementById(generateCellId('tg',shotResult.firedPos));
  if(!shotResult.status) {
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  } else {
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
  }
};

const checkAndDisplayShot=function(event) {
  let firedPosition=parseCoordinates(event.target.id);
  let data = {firedPosition:firedPosition};
  data = utils.toS(data);
  sendJsonData(utils.post(),"/isHit",displayShot,data);
};
