let shipSize = undefined;
let shipName = '';
let direction = 'south';
let shipsHeadPositions = [];


const remHighlightOnShips = function(){
  getPlacedShipsCells().forEach((cellId)=>{
    document.getElementById(cellId).style["background-color"]=null;
  });
};

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
  if(doesShipOverlap(event)){
    showInvalidCell(event);
    removeHighlightOnShips();
    return;
  }
  if (lastCoord[1] < 10) {
    drawShip(event);
    removeHighlight(event);
    disableMouseEvents();
    markCellsChecked(event);

    let shipDetails = {dir:direction,headPos:event.target.id,length:shipSize};
    shipsHeadPositions.push(shipDetails);
    document.getElementById(shipName).style.display="none";
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

const getPlacedShipsCells=function(){
  return shipsHeadPositions.map(function(ship){
    let coords = positionSystem[ship.dir](ship.headPos,ship.length);
    let cellIdList=coords.map(generateCellId);
    return cellIdList;
  }).join().split(',');
};

const doesShipOverlap=function(event){
  let shipCells=getAllCoordsOfShip(event);
  let allShipCells=getPlacedShipsCells();
  return shipCells.some(function(shipCell){
    return allShipCells.includes(shipCell);
  });
};
