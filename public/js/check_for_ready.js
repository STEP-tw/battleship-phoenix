const addListener = function() {
  let readyButton = document.getElementById('ready');
  readyButton.onclick = startGamePlay;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 5;
};

const startGamePlay=function(){
  if (areAllShipsPlaced()) {
    let readyButton=document.querySelector('.buttonBlock a');
    readyButton.href="/create-game";
    return;
  }
  document.querySelector('.messageBox').innerHTML="Please place all your ships";
};
