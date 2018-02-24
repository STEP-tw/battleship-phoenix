const afterCancel = function(){
  document.querySelector(".popup").style.display = "none";
  utils.clearIntervals();
};

const cancelGame = function(){
  let url = '/cancel-game';
  sendAjax(util.get(),url,afterCancel);
};

const startGame = function(){
  if(this.responseText){
    let messageBox = document.querySelector('.messageBox');
    messageBox.innerHTML = 'Game Starts';
  }
};

const canStartGame = function(){
  let url = '/start-game';
  sendAjax(utils.get(),url,startGame);
};

const sendAjax = function(method,url,callback,data) {
  let req = new XMLHttpRequest();
  req.open(method,url);
  req.setRequestHeader('Content-Type','application/json');
  req.onload = callback;
  req.send(data||"{}");
};

const updateOceanGrid = function(){
  let opponentShots = JSON.parse(this.responseText);
  opponentShots.shots.hits.forEach((hitCoord)=>{
    let cellId = generateCellId('og',hitCoord);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = "url('../assets/images/hit.png')";
  });
  opponentShots.shots.misses.forEach((missCoord)=>{
    let cellId = generateCellId('og',missCoord);
    let cell = document.getElementById(cellId);
    cell.style.backgroundImage = "url('../assets/images/miss.png')";
  });
};
const getOpponentShot = function(){
  sendAjax('get','/getOpponentShots',updateOceanGrid);
};

const reqForOpponentShot = function(){
  let interval = setInterval(getOpponentShot,3000);
};
