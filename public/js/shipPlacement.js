let shipSize = undefined;
let shipName = '';
let direction = 'south';
let shipsHeadPositions = [];

const makeShipPlacable = function (size){
  shipName =event.target.id;
  shipSize = size;
  document.getElementById(shipName).style.color="rgb(96, 96, 96)";
  addMouseEvent();
};

const addMouseEvent=function(){
  let tableCells = document.querySelectorAll('[id^="og"]');
  tableCells.forEach(id =>{
    if(!id.checked){
      id.onmouseover=showOccupiedPosition;
      id.onmouseout=removeHighlight;
      id.onclick=placeShip;
    }
  });
};

const placeShip = function(event){
  let coords = positionSystem[direction](event.target.id,shipSize);
  let lastCoord=coords[coords.length-1];
  if (lastCoord[1] < 10) {
    drawShip(event);
    removeHighlight(event);
    disableMouseEvents();
    markCellsChecked(event);

    let shipDetails = {dir:direction,headPos:event.target.id,length:shipSize};
    shipsHeadPositions.push(shipDetails);
    let ship = document.getElementById(shipName);
    ship.remove();
  }else {
    showInvalidCell(event);
  }
};

const markCellsChecked = function(){
  let coords = positionSystem[direction](event.target.id,shipSize);
  let cellIdList=coords.map(generateCellId);

  cellIdList.forEach((cellId)=>{
    document.getElementById(cellId).checked=true;
  });
};

const disableMouseEvents = function(){
  let tableCells = document.querySelectorAll('[id^="og"]');
  tableCells.forEach(id => {
    id.onmouseover=null;
    id.onmouseout=null;
    id.onclick=null;
  });
};

const getAllCoordsOfShip = function(event) {
  let coords = positionSystem[direction](event.target.id,shipSize);
  let cellIdList=coords.map(generateCellId);
  return cellIdList;
};
