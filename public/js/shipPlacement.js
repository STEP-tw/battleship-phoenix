let shipSize = undefined;
let shipName = '';
let direction = 'south';
let shipsHeadPositions = [];

const remHighlightOnShips = function(){
  let allShipCells = getPlacedShipsCells();
  allShipCells.forEach((cellId)=>{
    if(cellId){
      document.getElementById(cellId).style["background-color"]=null;
    }
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
  let coordinates = parseCoordinates(event.target.id);
  let coords = getCoordinates(direction,coordinates,shipSize);
  let lastCoord=coords[coords.length-1];
  if (lastCoord[1] < 10 && !doesShipOverlap(event)) {
    drawShip(event);
    removeHighlight(event);
    disableMouseEvents();
    markCellsChecked(event);

    let shipDetails = {dir:direction,headPos:event.target.id,length:shipSize};
    shipsHeadPositions.push(shipDetails);
    document.getElementById(shipName).style.display="none";
  }else {
    showInvalidCell(event);
    remHighlightOnShips();
  }
};

const markCellsChecked = function(){
  let coordinates = parseCoordinates(event.target.id);
  let coords = getCoordinates(direction,coordinates,shipSize);
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

const getAllCoordsOfShip = function(id) {
  let parsedCoordinates = parseCoordinates(event.target.id);
  let coords = getCoordinates(direction,parsedCoordinates,shipSize);
  let cellIdList=coords.map(generateCellId);
  return cellIdList;
};

const getPlacedShipsCells=function(){
  return shipsHeadPositions.map(function(ship){
    let headPos = parseCoordinates(ship.headPos);
    let coords = getCoordinates(ship.dir,headPos,ship.length);
    let cellIdList=coords.map(generateCellId);
    return cellIdList;
  }).join().split(',');
};

const doesShipOverlap=function(event){
  let shipCells=getAllCoordsOfShip(event.target.id);
  return cellsThatOverlap(shipCells).length != 0;
};

const cellsThatOverlap = function(shipCells){
  let allShipCells=getPlacedShipsCells();
  return shipCells.filter(function(shipCell){
    return allShipCells.includes(shipCell);
  });
};

const parseCoordinates = (cellId)=>{
  let coords = cellId.split('_').slice(1).map(convertToNumber);
  return coords;
};

const convertToNumber = function(coordAsString){
  return +coordAsString;
};
