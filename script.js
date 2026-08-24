const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cellSize = 60;

const cols = Math.ceil(canvas.width / cellSize);
const rows = Math.ceil(canvas.height / cellSize);

console.log("Columns:", cols);
console.log("Rows:", rows);

 const grid = [];

for (let row = 0; row < rows; row++) {
    const currentRow = [];

    for (let col = 0; col < cols; col++) {

        const cell = {
            row: row,
            col: col,

            visited: false,

            walls: {
                top: true,
                right: true,
                bottom: true,
                left: true
            }
        };

        currentRow.push(cell);
    }

    grid.push(currentRow);
}

function drawCell(cell) {
    const x = cell.col * cellSize;
    const y = cell.row * cellSize;

    ctx.strokeStyle = "#8a8376";
    ctx.lineWidth = 2;

    if (cell.walls.top) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
    }

    if (cell.walls.right) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
    }

    if (cell.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
    }

    if (cell.walls.left) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
    }
}


function getUnvisitedNeighbors(cell) {
    const neighbors = [];

    const row = cell.row;
    const col = cell.col;

    const top = row > 0 ? grid[row - 1][col] : null;
    const right = col < cols - 1 ? grid[row][col + 1] : null;
    const bottom = row < rows - 1 ? grid[row + 1][col] : null;
    const left = col > 0 ? grid[row][col - 1] : null;

    if (top && !top.visited) {
        neighbors.push(top);
    }

    if (right && !right.visited) {
        neighbors.push(right);
    }

    if (bottom && !bottom.visited) {
        neighbors.push(bottom);
    }

    if (left && !left.visited) {
        neighbors.push(left);
    }

    return neighbors;
}

function getRandomNeighbor(cell) {
    const neighbors = getUnvisitedNeighbors(cell);

    if (neighbors.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * neighbors.length);

    return neighbors[randomIndex];
}

function removeWalls(current, next) {
    const rowDifference = current.row - next.row;
    const colDifference = current.col - next.col;

    if (rowDifference === 1) {
        current.walls.top = false;
        next.walls.bottom = false;
    }

    if (rowDifference === -1) {
        current.walls.bottom = false;
        next.walls.top = false;
    }

    if (colDifference === 1) {
        current.walls.left = false;
        next.walls.right = false;
    }

    if (colDifference === -1) {
        current.walls.right = false;
        next.walls.left = false;
    }
}

const stack = [];

let current = grid[0][0];
current.visited = true;

while (true) {
    const next = getRandomNeighbor(current);

    if (next) {
        next.visited = true;

        stack.push(current);

        removeWalls(current, next);

        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    } else {
        break;
    }
}

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        drawCell(grid[row][col]);
    }
}
