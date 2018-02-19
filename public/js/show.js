
const showOccupiedPosition = function(event){
  if((event.target.id).startsWith('og')){
    let coords = positionSystem[direction](event.target.id,shipSize);
    let cellIdList=coords.map(generateCellId);

    cellIdList.forEach((cellId)=>{
      let cell=document.getElementById(cellId);
      cell.style["background-color"]="rgba(51, 51, 54, 0.83)";
      cell.style.cursor="move";
    });
  }
};

const removeHighlight = function(event){
  if((event.target.id).startsWith('og')){
    let coords = positionSystem[direction](event.target.id,shipSize);
    let cellIdList=coords.map(generateCellId);

    cellIdList.forEach((cellId)=>{
      if(!document.getElementById(cellId).checked) {
        document.getElementById(cellId).style["background-color"]=null;
      }
    });
  }
};

const drawShip = function(event){

  let coords = positionSystem[direction](event.target.id,shipSize);
  let cellIdList=coords.map(generateCellId);

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
