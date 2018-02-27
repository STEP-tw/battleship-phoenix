let shipSize = undefined;
let shipName = '';
let direction = 'south';
let shipsHeadPositions = [];
let isPlaced = false;

const remHighlightOnShips = function(){
  let allShipCells = getPlacedShipsCells();
  allShipCells.forEach((cellCoord)=>{
    let cell = document.getElementById(cellCoord);
    if(cell){
      cell.style["background-color"]=null;
    }
  });
};

const isAllShipsPlaced = function(){
  return shipsHeadPositions.length == 5;
};

const makeShipPlacable = function (event,size){
  shipName =event.target.id;
  shipSize = size;

  document.getElementById(shipName).style.color="rgb(96, 96, 96)";
  let ships=document.querySelectorAll('.shipsBlock li');

  ships.forEach((ship)=>{
    ship.style.color='rgb(67, 195, 199)';
  });

  addMouseEvent();
  isPlaced = false;
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

const parseIdToCoords = function(id){
  let parsed = id.split('_');
  parsed.shift();
  parsed = parsed.map((element)=>{
    return +element;
  });
  return parsed;
};

const replaceShip = function(event,cellIdList){
  if(isPlaced){
    shipsHeadPositions = shipsHeadPositions.filter((ship)=>{
      return !areEqual(ship.headPos,parseIdToCoords(cellIdList[0]));
    });
    cellIdList.forEach((cell)=>{
      let occupiedCell = document.querySelector(`#${cell}`);
      occupiedCell.style.backgroundImage = null;
      occupiedCell.style.backgroundColor = "rgba(177, 177, 177, 0.63)";
      occupiedCell.checked = false;
    });
    document.getElementsByClassName(cellIdList.length)[0].click();
  }
};

const addClickForReposition = function(event){
  let cellIdList = getAllCoordsOfShip(event.target.id);
  cellIdList.forEach((cell)=>{
    let occupiedCell = document.querySelector(`#${cell}`);
    occupiedCell.ondblclick = ()=>{
      replaceShip(event,cellIdList);
    };
  });
};

const placeShip = function(event){
  let coordinates = parseCoordinates(event.target.id);
  let coords = getCoordinates(direction,coordinates,shipSize);
  let lastCoord=coords[coords.length-1];

  if (lastCoord[1] < 10 && !doesShipOverlap(event)) {
    drawShip(event);
    removeHighlight();
    disableMouseEvents();

    markCellsChecked(event);
    storePlacedShips(event);
    displayReadyButton();

    addClickForReposition(event);
    isPlaced = true;
  }else {
    showInvalidCell(event);
    remHighlightOnShips();
  }
};

const displayReadyButton = function(){
  if(isAllShipsPlaced()){
    document.getElementById("ready").style.display = "inline-block";
  }
};

const storePlacedShips = function(event){
  let shipCoord = parseCoordinates(event.target.id);
  let shipDetails = {dir:direction,headPos:shipCoord,length:shipSize};
  shipsHeadPositions.push(shipDetails);
  document.getElementById(shipName).style.display="none";
};

const markCellsChecked = function(event){
  let coordinates = parseCoordinates(event.target.id);
  let coords = getCoordinates(direction,coordinates,shipSize);
  let cellIdList=coords.map((cellId)=>generateCellId('og',cellId));

  cellIdList.forEach((cellId)=>{
    document.getElementById(cellId).checked=true;
  });
};

const disableMouseEvents = function(){
  let tableCells = document.querySelectorAll('[id^="og"]');
  tableCells.forEach(id => {
    if(!id.checked){
      id.ondblclick=null;
      id.onclick=null;
    }
    id.onmouseout=null;
    id.onmouseover=null;
    id.onclick=rotateShip;
  });
};

const getAllCoordsOfShip = function(id) {
  let parsedCoordinates = parseCoordinates(id);
  let coords = getCoordinates(direction,parsedCoordinates,shipSize);
  let cellIdList=coords.map((cellId)=>generateCellId('og',cellId));
  return cellIdList;
};

const getPlacedShipsCells=function(){
  return shipsHeadPositions.map(function(ship){
    let headPos = ship.headPos;
    let coords = getCoordinates(ship.dir,headPos,ship.length);
    let cellIdList=coords.map((cellId)=>generateCellId('og',cellId));
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
