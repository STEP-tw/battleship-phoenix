const createGrid = function(tableName) {
  for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
    let row = document.createElement('tr');
    for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
      let cell = document.createElement('td');
      cell.id = `${rowIndex}_${columnIndex}`;
      cell.style.border = "1px solid black";
      row.appendChild(cell);
    }
    let table = document.getElementById(tableName);
    table.appendChild(row);
  }
};

let drawGrid = function(){
  createGrid('targetGrid');
  createGrid('oceanGrid');
};
window.onload = drawGrid;
