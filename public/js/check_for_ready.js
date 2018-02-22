let interval;
let hasOpponentWonInterval;
const addListener = function() {
  let readyButton = document.getElementById('ready');
  readyButton.onclick = startGamePlay;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 5;
};

const getCellIdForTG = function(coordinates) {
  let cellId=`tg_${coordinates[0]}_${coordinates[1]}`;
  return cellId;
};
const startGamePlay=function(){
  if (areAllShipsPlaced()) {
    loadFleet();
    document.getElementById('ready').style.display = 'none';
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

const displayLost = function(){
  let response = JSON.parse(this.responseText);
  if(response.status){
    clearInterval(hasOpponentWonInterval);
    document.querySelector('#targetGrid').onclick = null;
    alert('lost')
  }
}

const showWaitingMessage = function() {
  let response = JSON.parse(this.responseText);
  document.querySelector('.messageBox').innerHTML=
    "Waiting for opponent to place ships";
  if (response.status) {
    document.querySelector('.messageBox').innerHTML="Game Started";
    document.querySelector('#targetGrid').onclick = checkAndDisplayShot;
    clearInterval(interval);
    hasOpponentWonInterval = setInterval(()=>{
      sendReq('GET','/hasOpponentWon',displayLost);
    },1000);
    return;
  }
};

const askIsOpponentReady = function() {
  sendReq('GET','/arePlayersReady',showWaitingMessage);
};

window.onbeforeunload = ()=>{
  return 'do you want to reload this page?';
};

const displayWon=function(){
  let response = JSON.parse(this.responseText);
  if(response.status){
    clearInterval(hasOpponentWonInterval);
    document.querySelector('#targetGrid').onclick = null;
    alert('won');
  }
}

const displayShot = function() {
  let shotResult = JSON.parse(this.responseText);
  let cell = document.getElementById(getCellIdForTG(shotResult.firedPos));
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
  data = JSON.stringify(data);
  sendJsonData("POST","/isHit",displayShot,data);
};
