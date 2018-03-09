const createGrid = function(tableName,prefix,rowSize,colSize) {
  let table = document.getElementById(tableName);
  for (let rowIndex = 0; rowIndex < rowSize; rowIndex++) {
    let row = document.createElement('tr');
    row = createRow(row,colSize,rowIndex,prefix);
    table.appendChild(row);
  }
};

const createRow = function(row,colSize,rowIndex,prefix){
  for (let colIndex = 0; colIndex < colSize; colIndex++) {
    let cell = document.createElement('td');
    cell.id = `${prefix}_${colIndex}_${rowIndex}`;
    cell.checked = false;
    row.appendChild(cell);
  }
  return row;
};

const displayQuitGameOption = function (){
  document.querySelector('#quit').style.display='block';
};

const displayLeaveGame = function (){
  document.querySelector('#leave').style.display='block';
};

const initializeQuit = function() {
  let leaveGameButton = document.querySelector('#leaveGame');
  let quitButton = document.querySelector('#quitGame');
  quitButton.onclick=displayQuitGameOption;
  leaveGameButton.onclick = displayLeaveGame;
};

const initializeCancel = function() {
  let cancelButton = document.querySelector('#No');
  cancelButton.onclick = ()=>{
    document.querySelector('#quit').style.display='none';
  };
  cancelButton = document.querySelector('#NotLeave');
  cancelButton.onclick = ()=>{
    document.querySelector('#leave').style.display='none';
  };
};

const handleAudios = function(){
  let backgroundMusic = document.querySelector('#bgm');
  let response = utils.getResponse(this);
  response.music = utils.parse(response.music);
  backgroundMusic.play();
  backgroundMusic.muted = !response.music;
};

let setupGame = function(){
  createGrid('targetGrid','tg',10,10);
  createGrid('oceanGrid','og',10,10);
  addListener();
  initializeQuit();
  initializeCancel();
  getAndUpdateGameStatus();
  document.querySelector('#leaveGame').style.display= 'block';
  showShipDetailsOnHover();
  utils.sendAjax(utils.get(),'/audioStatus',handleAudios);
  document.querySelector('#loader-wrapper').style.display = 'none';
};

window.onload = setupGame;
