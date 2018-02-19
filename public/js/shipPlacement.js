let shipSize = undefined;
let direction = 'south';
let shipsHeadPositions = [];

const makeShipPlacable = function (size){
  shipSize = size;
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
  drawShip(event);
  removeHighlight(event);
  disableMouseEvents();
  markCellsChecked(event);

  let shipDetails = {dir:direction,headPos:event.target.id,length:shipSize};
  shipsHeadPositions.push(shipDetails);
  document.getElementById(shipSize).style.display="none";
};

const markCellsChecked = function(){
  let coords = positionSystem['south'](event.target.id,shipSize);
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
