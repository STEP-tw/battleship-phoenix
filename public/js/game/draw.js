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

const quitGameOption = function (){
  document.getElementById('quit').style.display='block';
};

const initializeQuit = function() {
  let quitButton = document.getElementById('quitGame');
  quitButton.onclick=quitGameOption;
};

const cancelQuit = function() {
  let cancelButton = document.getElementById('No');
  cancelButton.onclick = ()=>{
    document.getElementById('quit').style.display='none';
    hasOpponentLeft();
  };
};

let setupGame = function(){
  createGrid('targetGrid','tg',10,10);
  createGrid('oceanGrid','og',10,10);
  addListener();
  initializeQuit();
  cancelQuit();
  getAndUpdateGameStatus();
  // hasOpponentLeft();
  showShipDetailsOnHover();
  document.querySelector('#loader-wrapper').style.display = 'none';
};

window.onload = setupGame;
