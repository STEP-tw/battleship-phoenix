const addListener = function() {
  let readyButton = document.getElementById('ready');
  readyButton.onclick = startGamePlay;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 5;
};

const startGamePlay=function(){
  if (areAllShipsPlaced()) {
    createGame();
    document.querySelector('#oceanGrid').onclick = null;
    return;
  }
  document.querySelector('.messageBox').innerHTML="Please place all your ships";
};
