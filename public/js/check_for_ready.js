let interval;
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
    interval = setInterval(()=>{
      sendReq('GET','/arePlayersReady',showWaitingMessage);
    },1000);
    return;
  }
  document.querySelector('.messageBox').innerHTML="Please place all your ships";
};

const loadFleet = function() {
  let fleetDetails = `fleetDetails=${JSON.stringify(shipsHeadPositions)}`;
  sendReq('POST','/start-game',null,fleetDetails);
};

const showWaitingMessage = function() {
  document.querySelector('.messageBox').innerHTML=
    "Waiting for opponent to place ships";
  if (this.responseText=="true") {
    document.querySelector('.messageBox').innerHTML="Game Started";
    clearInterval(interval);
    return;
  }
};

const askIsOpponentReady = function() {
  sendReq('GET','/arePlayersReady',showWaitingMessage);
};
