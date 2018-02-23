let interval;
let hasOpponentWonInterval;
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
  let message = myTurn ? 'My turn' : 'Opponent\'s turn';
  utils.updateMessage(message);
};

const displayLost = function(){
  let response = JSON.parse(this.responseText);
  if(response.status){
    clearInterval(hasOpponentWonInterval);
    document.querySelector('#targetGrid').onclick = null;
    document.querySelector('.defeat').style.display = "block";
  }
};

const highlightCell = function(event){
  let cellId = event.target.id;
  let cell = document.getElementById(cellId);
  cell.style["background-color"]="rgba(177, 177, 177, 0.63)";
};

const remCellHighlight = function(event){
  let cellId = event.target.id;
  document.getElementById(cellId).style["background-color"]=null;
};

const makeTargetGridFirable = function(){
  let targetGridCells = document.querySelectorAll('[id^="tg"]');
  targetGridCells.forEach((targetGridCell)=>{
    targetGridCell.onmouseover = highlightCell;
    targetGridCell.onmouseout = remCellHighlight;
  });
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
    document.getElementById('targetGrid').setAttribute('class','tg');
    makeTargetGridFirable();
    hasOpponentWonInterval = setInterval(()=>{
      sendReq('GET','/hasOpponentWon',displayLost);
    },1000);
    return;
  }
};

const askIsOpponentReady = function() {
  sendReq(utils.get(),'/arePlayersReady',showWaitingMessage);
};
//
// window.onbeforeunload = ()=>{
//   return 'do you want to reload this page?';
// };

const displayWon=function(){
  let response = JSON.parse(this.responseText);
  if(response.status){
    clearInterval(hasOpponentWonInterval);
    document.querySelector('#targetGrid').onclick = null;
    document.querySelector('.victory').style.display = "block";
  }
};

const displayShot = function() {
  let shotResult = utils.parse(this.responseText);
  let cell = document.getElementById(generateCellId('tg',shotResult.firedPos));
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
  data = utils.toS(data);
  sendJsonData(utils.post(),"/isHit",displayShot,data);
};
