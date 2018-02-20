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
    createGame();
    return;
  }
  document.querySelector('.messageBox').innerHTML="Please place all your ships";
};

const loadFleet = function() {
  let fleetDetails = `fleetDetails=${JSON.stringify(shipsHeadPositions)}`;
  sendReq('POST','/start-game',null,fleetDetails);
};
