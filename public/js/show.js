const showOccupiedPosition = function(event){
  let cellIdList = getAllCoordsOfShip(event);
  let color = "rgba(177, 177, 177, 0.63)";
  if(!doesShipOverlap(event)){
    changeCellColor(cellIdList,color);
    remHighlightOnShips();
    return;
  }
  showInvalidCell(event);
};

const removeHighlight = function(event){
  let cellIdList = getAllCoordsOfShip(event);
  cellIdList.forEach((cellId)=>{
    if(!document.getElementById(cellId).checked) {
      document.getElementById(cellId).style["background-color"]=null;
    }
  });
};

const drawShip = function(event){

  let cellIdList = getAllCoordsOfShip(event);

  let headCell =document.getElementById(cellIdList[0]);
  headCell.style.backgroundImage = "url('../assets/images/head.png')";

  let tailCell =document.getElementById(cellIdList[cellIdList.length-1]);
  tailCell.style.backgroundImage = "url('../assets/images/tail.png')";

  for(let iter=1; iter < cellIdList.length-1; iter++){
    let cell =document.getElementById(cellIdList[iter]);
    cell.style.backgroundImage = "url('../assets/images/body.png')";
  }
};

const generateCellId = function (coordinates){
  let cellId=`og_${coordinates[0]}_${coordinates[1]}`;
  return cellId;
};

const showInvalidCell = function(event) {
  remHighlightOnShips();
  let cellIdList = getAllCoordsOfShip(event);
  let overLappingCells= cellsThatOverlap(cellIdList);
  let color = "rgba(255, 9, 9, 0.3)";
  changeCellColor(overLappingCells,color);
  changeCellColor(cellIdList,color);
};

const changeCellColor = function(cellIdList,color){
  cellIdList.forEach((cellId)=>{
    let cell=document.getElementById(cellId);
    cell.style["background-color"]=color;
    cell.style.cursor="move";
  });
};
