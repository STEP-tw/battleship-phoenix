const changeDirection = function (direction) {
  let nextDir = {
    south: "west",
    west: "north",
    north: "east",
    east: "south"
  };
  return nextDir[direction];
};

const isBetweenZeroAndTen = function (number) {
  return number >= 0 && number < 10;
};


const validateShipAllPos = function (coord) {
  return isBetweenZeroAndTen(coord[0]) &&
    isBetweenZeroAndTen(coord[1]);
};

const isShipCell = function (position, listOfPos) {
  return listOfPos.some((pos) => {
    return utils.areEqual(pos,position);
  });
};

const getShipByCellPos = function (coord) {
  let ship = shipsHeadPositions.filter((ship) => {
    let shipCoords = getCoordinates(ship.dir, ship.headPos, ship.length);
    return isShipCell(coord, shipCoords);
  })[0];
  return ship;
};

let dir;
const rotateShip = function (event) {
  let coord = parseCoordinates(event.target.id);
  let ship = getShipByCellPos(coord);
  if (!ship) {
    return;
  }
  let oldshipCoords = getCoordinates(ship.dir, ship.headPos, ship.length);
  dir = changeDirection(dir || ship.dir);
  let newShipCoords = getCoordinates(dir, ship.headPos, ship.length);
  let isValidCoord = validateShipAllPos(newShipCoords[ship.length - 1]);
  let oldShipDir = ship.dir;
  let hasAnyCellOccupyShip = newShipCoords.filter(getShipByCellPos);
  let overlapsOnItself = hasAnyCellOccupyShip.length > 1 && ship.dir != dir;
  ship.dir = oldShipDir;
  if (!isValidCoord || overlapsOnItself ) {
    rotateShip(event);
    return;
  }
  removeShip(oldshipCoords);
  ship.dir = dir;
  drawShip(ship.headPos, ship.dir,ship.length);
  handleMouseEvents();
  addClickForReposition(event,ship.headPos);
};

const removeShip = function (shipCoords) {
  shipCoords.forEach((coord) => {
    let cellId = document.getElementById(generateCellId("og", coord));
    cellId.style.backgroundImage = null;
    cellId.checked = false;
    cellId.onmouseover=showOccupiedPosition;
    cellId.onmouseout=removeHighlight;
    cellId.onclick=placeShip;
  });
};


const getShipImageByDir = function (direction) {
  let shipImages = {
    hit:{
      head: `${direction}_head_hit.png`,
      tail: `${direction}_tail_hit.png`,
      body: `${direction}_body_hit.png`
    },
    initial:{
      head: `${direction}_head.png`,
      tail: `${direction}_tail.png`,
      body: `${direction}_body.png`
    }
  };
  return shipImages;
};


const disableOceanGrid = function(){
  let tableCells = document.querySelectorAll('[id^="og"]');
  tableCells.forEach(id => {
    id.onmouseover=null;
    id.onmouseout=null;
    id.onclick=null;
    id.ondblclick=null;
  });
};
