const showOccupiedPosition = function(event){
  let coord = parseCoordinates(event.target.id);
  let cellIdList = getAllCoordsOfShip(coord);
  let color = "rgba(177, 177, 177, 0.63)";
  if(!doesShipOverlap(event)){
    changeCellColor(cellIdList,color);
    remHighlightOnShips();
    return;
  }
  showInvalidCell(event);
};

const removeHighlight = function(event){
  let cellIdList = document.querySelectorAll('[id^="og"]');
  cellIdList.forEach((cell)=>{
    if (cell) {
      if(!cell.checked) {
        cell.style["background-color"]=null;
      }
    }
  });
};

const drawShip = function(coord,direction="south",size=shipSize,type="initial"){
  let cellIdList = getAllCoordsOfShip(coord,direction,size);
  let headCell =document.getElementById(cellIdList[0]);
  headCell.style.backgroundImage
  = `url('../assets/images/${getShipImageByDir(direction)[type]["head"]}')`;

  let tailCell =document.getElementById(cellIdList[cellIdList.length-1]);
  tailCell.style.backgroundImage
  = `url('../assets/images/${getShipImageByDir(direction)[type]["tail"]}')`;

  for(let iter=1; iter < cellIdList.length-1; iter++){
    let cell =document.getElementById(cellIdList[iter]);
    cell.style.backgroundImage
     = `url('../assets/images/${getShipImageByDir(direction)[type]["body"]}')`;
  }
};

const generateCellId = function (gridId,coordinates){
  let cellId=`${gridId}_${coordinates[0]}_${coordinates[1]}`;
  return cellId;
};

const showInvalidCell = function(event) {
  remHighlightOnShips();
  let coord = parseCoordinates(event.target.id);
  let cellIdList = getAllCoordsOfShip(coord);
  let overLappingCells= cellsThatOverlap(cellIdList);
  let color = "rgba(255, 9, 9, 0.3)";
  changeCellColor(overLappingCells,color);
  changeCellColor(cellIdList,color);
};

const changeCellColor = function(cellIdList,color){
  cellIdList.forEach((cellId)=>{
    let cell=document.getElementById(cellId);
    if(cell){
      cell.style["background-color"]=color;
      cell.style.cursor="move";
    }
  });
};

const getShipDetails = function(shipName){
  let shipDetails = {
    carrier: '5 HITS TO SINK CARRIER',
    battleship: '4 HITS TO SINK BATTLESHIP',
    cruiser: '3 HITS TO SINK CRUISER',
    submarine: '3 HITS TO SINK SUBMARINE',
    destroyer: '2 HITS TO SINK DESTROYER'
  };
  return shipDetails[shipName];
};

const toHtml = function(shipDetails,shipName){
  let imageUrl = `<img src = ../assets/images/${shipName}.png>`;
  let shipDetailsHtml = `<h2>${(shipName).toUpperCase()}</h2><br>${imageUrl}`;
  shipDetailsHtml += `<br>${getShipDetails(shipName)}`;
  return shipDetailsHtml;
};

const showDetails = function(event){
  let shipName = event.target.id;
  let shipDetails = document.querySelector('.shipDetails');
  shipDetails.innerHTML = toHtml(shipDetails,shipName);
  shipDetails.style.display = 'block';
};

const hideDetails = function(event){
  let shipDetails = document.querySelector('.shipDetails');
  shipDetails.style.display = 'none';
};

const showShipDetailsOnHover = function(){
  let shipNames = document.querySelectorAll('li');
  shipNames.forEach((ship)=>{
    ship.onmouseover = showDetails;
    ship.onmouseout = hideDetails;
  });
};
