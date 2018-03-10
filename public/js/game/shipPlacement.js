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

const disableCheckedCells = function(){
  let tableCells = document.querySelectorAll('[id^="og"]');
  tableCells.forEach(id => {
    if(id.checked){
      id.ondblclick=null;
      id.onclick=null;
    }
  });
};

const makeShipPlacable = function (event,size){
  shipName =event.target.id;
  shipSize = size;
  disableCheckedCells();
  document.getElementById(shipName).style.display='block';
  let ships=document.querySelectorAll('.shipsBlock li');

  ships.forEach((ship)=>{
    ship.style.color='rgb(67, 195, 199)';
  });

  document.getElementById(shipName).style.color="rgb(96, 96, 96)";
  document.querySelector('#ready').style.display='none';
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

const repositionShip = function(shipName){
  let ship = document.getElementById(shipName);
  ship.click();
};

const replaceShip = function(event,cellIdList){
  let tableCells = document.querySelectorAll('[id^="og"]');
  tableCells.forEach(id => {
    id.onclick=null;
  });
  if(isPlaced){
    let ship = shipsHeadPositions.filter((ship)=>{
      return utils.areEqual(ship.headPos,cellIdList[0]);
    });
    shipsHeadPositions = shipsHeadPositions.filter((ship)=>{
      return !utils.areEqual(ship.headPos,cellIdList[0]);
    });

    cellIdList.forEach((cell)=>{
      let occupiedCell=document.querySelector(`#${generateCellId('og',cell)}`);
      occupiedCell.style.backgroundImage = null;
      occupiedCell.style.backgroundColor = "rgba(177, 177, 177, 0.63)";
      occupiedCell.checked = false;
    });
    repositionShip(ship[0].name);
  }
};

const getHeadPositionOf = function(id){
  let selectedShip = shipsHeadPositions.filter((ship)=>{
    let shipCoords = getCoordinates(ship.dir,ship.headPos,ship.length);
    return shipCoords.some((coord)=>{
      return utils.areEqual(coord,id);
    });
  });
  return selectedShip[0].headPos||[];
};

const addClickForReposition = function(event,headPosition){
  let parsedCoordinate = parseCoordinates(event.target.id);
  let headPos = headPosition || getHeadPositionOf(parsedCoordinate);
  let ship = shipsHeadPositions.find((shipHead)=>{
    return utils.areEqual(headPos,shipHead.headPos);
  });
  let cellIdList = getCoordinates(ship.dir,headPos,ship.length);
  direction = ship.dir;
  cellIdList.forEach((cell)=>{
    let occupiedCell = document.querySelector(`#${generateCellId('og',cell)}`);
    occupiedCell.ondblclick = ()=>{
      replaceShip(event,cellIdList);
    };
  });
};

const placeShip = function(event){
  let coordinates = parseCoordinates(event.target.id);
  let coords = getCoordinates(direction,coordinates,shipSize);
  let lastCoord=coords[coords.length-1];

  if (isShipInRange(lastCoord,0,10) && !doesShipOverlap(event)) {
    drawShip(coordinates);
    removeHighlight(event);
    handleMouseEvents();
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
  let shipDetails = {dir:direction,headPos:shipCoord,length:shipSize,
    name:shipName};
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

const handleMouseEvents = function(){
  let tableCells = document.querySelectorAll('[id^="og"]');
  tableCells.forEach(id => {
    if(!id.checked){
      id.ondblclick=null;
      id.onclick=null;
    }
    id.onmouseout=null;
    id.onmouseover=null;
    id.onclick=handleSingleAndDblClick;
  });
};

const handleSingleAndDblClick = function(event){
  let singleClickTimer;
  let clickCount = 0;
  clickCount++;

  if(clickCount === 1){
    singleClickTimer = setTimeout(()=>{
      clickCount = 0;
      rotateShip(event);
    },300);
  }else if(clickCount === 2){
    clearTimeout(singleClickTimer);
    clickCount = 0;
  }
};

const getAllCoordsOfShip = function(coord,dir=direction,size=shipSize) {
  let coords = getCoordinates(dir,coord,size);
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
  let coord = parseCoordinates(event.target.id);
  let shipCells=getAllCoordsOfShip(coord);
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

const isShipInRange = function(lastCoord,lowerBoundary,upperBoundary) {
  return lastCoord[1] < upperBoundary && lastCoord[1] >= lowerBoundary
  && lastCoord[0] >= lowerBoundary && lastCoord[0] < upperBoundary;
};
