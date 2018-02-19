const addListener = function() {
  let readyButton = document.getElementById('ready');
  readyButton.onclick = startGamePlay;
};

const areAllShipsPlaced=function(){
  let placedShips=document.querySelectorAll(".shipsBlock ul li");
  return placedShips.length == 0;
};

const startGamePlay=function(){
  if (areAllShipsPlaced()) {
    let readyButton=document.querySelector('.buttonBlock a');
    readyButton.href="/create-game";
    return;
  }
  document.querySelector('.messageBox').innerHTML="Please place all your ships";
};
