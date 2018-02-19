const addListener = function() {
  let readyButton = document.getElementById('ready');
  readyButton.onclick = startGamePlay;
};

const areAllShipsPlaced=function(){
  let selector='.shipsBlock ul [style="display: none;"]';
  let placedShips=document.querySelectorAll(selector);
  return placedShips.length == 5;
};

const startGamePlay=function(){
  if (areAllShipsPlaced()) {
    let readyButton=document.querySelector('.buttonBlock a');
    readyButton.href="/create-game";
    return;
  }
  alert("Please place all ships");
};
