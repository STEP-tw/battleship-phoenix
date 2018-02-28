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
  let coord = parseCoordinates(event.target.id);
  let cellIdList = getAllCoordsOfShip(coord);
  cellIdList.forEach((cellId)=>{
    let cell = document.getElementById(cellId);
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
