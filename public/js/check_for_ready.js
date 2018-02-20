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
    interval = setInterval(askIsOpponentReady,1000);
    return;
  }
  document.querySelector('.messageBox').innerHTML="Please place all your ships";
};

const loadFleet = function() {
  let fleetDetails = `fleetDetails=${JSON.stringify(shipsHeadPositions)}`;
  sendReq('POST','/start-game',null,fleetDetails);
};

const showOpponentArrival = function() {
  let popupBoxDisplay=document.querySelector(".popup").style;
  popupBoxDisplay.display = "block";
  if (this.responseText=="true") {
    document.querySelector('.messageBox').innerHTML="Game Started";
    clearInterval(interval);
    setTimeout(popupBoxDisplay.display = "none",1000);
    return;
  }
};

const askIsOpponentReady = function() {
  sendReq('get','/arePlayersReady',showOpponentArrival);
};
