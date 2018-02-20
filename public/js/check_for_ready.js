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
    document.querySelector('#oceanGrid').onclick = null;
    return;
  }
  document.querySelector('.messageBox').innerHTML="Please place all your ships";
};

const loadFleet = function() {
  let fleetDetails = `fleetDetails=${JSON.stringify(shipsHeadPositions)}`;
  sendReq('POST','/start-game',drawShips,fleetDetails);
};

const drawShips =function (){
  let shipDetails = this.responseText;
  shipDetails.forEach((shipInfo)=>{
    let cellIdList = getAllCoordsOfShip(shipInfo.headPos);

    let headCell =document.getElementById(cellIdList[0]);
    headCell.style.backgroundImage = "url('../assets/images/head.png')";

    let tailCell =document.getElementById(cellIdList[cellIdList.length-1]);
    tailCell.style.backgroundImage = "url('../assets/images/tail.png')";

    for(let iter=1; iter < cellIdList.length-1; iter++){
      let cell =document.getElementById(cellIdList[iter]);
      cell.style.backgroundImage = "url('../assets/images/body.png')";
    }
  });
};
