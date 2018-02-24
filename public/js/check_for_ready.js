const addListener = function() {
  let readyButton = utils.getReadyButton();
  readyButton.onclick = handleReady;
};

const areAllShipsPlaced=function(){
  return shipsHeadPositions.length == 5;
};

const handleReady=function(){
  if (areAllShipsPlaced()) {
    document.getElementsByClassName('shipsBlock')[0].style.display='none';
    loadFleet();
    utils.getReadyButton().style.display = 'none';
    utils.poll(utils.get(),'/arePlayersReady',handleStartGame);
  } else {
    utils.updateMessage("Please place all your ships");
  }
};

const handleStartGame = function () {
  let response = utils.parse(this.responseText);
  response.status ? gameStarts(response) : showWaitingMessage();
};

const gameStarts = function (response) {
  utils.clearIntervals();
  let myTurn = response.myTurn;
  let targetGrid = utils.getTargetGrid();
  utils.updateMessage("Game Started");
  handleTurn(myTurn);
  dontAllowHover('og',myTurn);
};

const loadFleet = function() {
  let fleet = utils.toS({fleetDetails : shipsHeadPositions});
  sendAjax(utils.post(),'/start-game',null,fleet);
};

const handleTurn = function (myTurn) {
  let message = myTurn ? 'My turn' : 'Opponent\'s turn';
  utils.updateMessage(message);
  if (myTurn) {
    utils.clearIntervals();
    makeTargetGridFirable(myTurn);
  }else {
    deactivateTargetGrid();
    utils.clearIntervals();
    sendAjax(utils.get(),'/hasOpponentWon',displayLost);
  }
};

const displayLost = function(){
  let response = utils.parse(this.responseText);
  if(response.status){
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    document.querySelector('.defeat').style.display = "block";
  }else {
    utils.setInterval(()=>{
      handleTurn(response.myTurn);
    });
  }
};

const deactivateTargetGrid = function () {
  let targetGrid = utils.getTargetGrid();
  targetGrid.onclick = null;
  dontAllowHover('tg');
};

const dontAllowHover = function(gridId,myTurn){
  let targetGridCells = document.querySelectorAll(`[id^="${gridId}"]`);
  targetGridCells.forEach((cell)=>{
    cell.onmouseover = function(event){
      document.querySelector(`#${event.target.id}`).style.cursor='not-allowed';
    };
  });
  document.getElementsByClassName('shipsBlock')[0].style.display='none';
};

const updateOceanGrid = function(){
  let opponentShots = utils.parse(this.responseText);
  opponentShots.shots.hits.forEach((hitCoord)=>{
    let cellId = generateCellId('og',hitCoord);
    let cell = document.getElementById(cellId);
    let imageUrl = cell.style.backgroundImage;
    cell.style.backgroundImage = getShipPartUrl(imageUrl);
  });
  opponentShots.shots.misses.forEach((missCoord)=>{
    let cellId = generateCellId('og',missCoord);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  });
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

const makeTargetGridFirable = function(myTurn){
  let targetGridCells = document.querySelectorAll('[id^="tg"]');
  targetGridCells.forEach((targetGridCell)=>{
    targetGridCell.onmouseover = highlightCell;
    targetGridCell.onmouseout = remCellHighlight;
  });
  targetGrid.onclick = checkAndDisplayShot;
  targetGrid.setAttribute('class','tg');
};

const showWaitingMessage = function() {
  let message = "Waiting for opponent to place ships";
  utils.updateMessage(message);
};


const displayWon=function(hasWon){
  if(hasWon){
    utils.clearIntervals();
    utils.getTargetGrid().onclick = null;
    document.querySelector('.victory').style.display = "block";
  }
};

const checkAndDisplayShot=function(event) {
  let firedPosition=parseCoordinates(event.target.id);
  let data = {firedPosition:firedPosition};
  data = utils.toS(data);
  sendAjax(utils.post(),"/updateFiredShot",displayShot,data);
};

const displayShot = function() {
  let shotResult = utils.parse(this.responseText);
  let cell = document.getElementById(generateCellId('tg',shotResult.firedPos));
  handleTurn(shotResult.myTurn);
  if(!shotResult.status) {
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  } else {
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
    displayWon(shotResult.winStatus);
  }
};
