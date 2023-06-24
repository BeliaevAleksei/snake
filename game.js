// 10 x 10

// x1,y1 x2,y1...
// x1,y2 x2,y2...
// 0 0 0 0 0 0 0 0 0
// ...
// 5row, 4,5,6 elem

// from 0 to
const gridHeight = 11;
const gridWidth = 11;
const gridId = "gameGrid";

class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  isOutOfGrid(coordinate) {
    return coordinate.x >= this.width || coordinate.y >= this.height || coordinate.y < 0 || coordinate.x < 0
  }
}

class Snake {
  /**
   * @param {*} startX
   * @param {*} startY
   * @param {*} snakeSize
   * @param {*} direct up, down, right, left  todo: complete
   */
  constructor(gameField) {
    this.gameField = gameField;
    this.state = [
      new Coordinate(4, 5),
      new Coordinate(5, 5),
      new Coordinate(6, 5),
    ];
  }
  isSnakeCoordinate(coordinate) {
    const equalCoordinates = this.state.filter((item) =>
      item.isEqual(coordinate)
    );
    return !!equalCoordinates.length;
  }
  getNextCoordinate(direction) {
    let nextCoordinate;
    const headCoordinate = this.state[this.state.length - 1];
    switch (direction) {
      case "right": {
        nextCoordinate = new Coordinate(headCoordinate.x + 1, headCoordinate.y);
        break;
      }
      case "left": {
        nextCoordinate = new Coordinate(headCoordinate.x - 1, headCoordinate.y);
        break;
      }
      case "up": {
        nextCoordinate = new Coordinate(headCoordinate.x, headCoordinate.y - 1);
        break;
      }
      case "down": {
        nextCoordinate = new Coordinate(headCoordinate.x, headCoordinate.y + 1);
        break;
      }
      default: {
        console.error("Wrong direction ", direction);
        return false;
      }
    }
    return nextCoordinate;
  }
  move(direction) {
    const nextCoordinate = this.getNextCoordinate(direction);

    if (this.canGoCoordinate(nextCoordinate)) {
      this.state.shift();
      this.state.push(nextCoordinate);
      return true;
    }
    return false;
  }
  canGoDirection(direction) {
    const nextCoordinate = this.getNextCoordinate(direction);
    return this.canGoCoordinate(nextCoordinate);
  }
  canGoCoordinate(coordinate) {
    if (!this.isSnakeCoordinate(coordinate)) {
      return true;
    }
    return false;
  }
  add(direction) {
    const nextCoordinate = this.getNextCoordinate(direction);

    if (this.canGoCoordinate(nextCoordinate)) {
      this.state.push(nextCoordinate);
      return true;
    }
    return false;
  }
}

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  isEqual(coordinate) {
    return this.x === coordinate.x && this.y === coordinate.y;
  }
}

class GameController {
  constructor(gridHeight, gridWidth) {
    this.direction = "right";
    this.gridField = new Grid(gridHeight, gridWidth);
    this.snake = new Snake(this.gridField);
    this.food = this.getFoodPosition();
    this.isGameOver = false
  }

  setDirection(direction) {
    if (this.snake.canGoDirection(direction)) {
      this.direction = direction;
    }
  }

  getFoodPosition() {
    let coordinate;
    do {
      const positionX = generateCoordinate(gridWidth);
      const positionY = generateCoordinate(gridHeight);
      coordinate = new Coordinate(positionX, positionY);
    } while (this.snake.isSnakeCoordinate(coordinate));

    return coordinate;
  }

  updateState() {
    const nextCoordinate = this.snake.getNextCoordinate(this.direction);
    if (this.snake.isSnakeCoordinate(nextCoordinate) || this.gridField.isOutOfGrid(nextCoordinate)) {
      this.isGameOver = true
      return
    }
    if (this.food.isEqual(nextCoordinate)) {
      this.snake.add(this.direction);
      this.food = this.getFoodPosition();
    } else {
      this.snake.move(this.direction);
    }
  }
}

function generateCoordinate(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

class GridRender {
  static render(gameController) {
    this.tableCreate(gameController);
    this.paintGrid(gameController);
  }

  static tableCreate(gameController) {
    const rootNode = document.getElementById("root");
    const table = document.createElement("table");
    table.setAttribute("id", gridId);

    for (let i = 0; i < gameController.gridField.height; i++) {
      const tr = table.insertRow();
      for (let j = 0; j < gameController.gridField.width; j++) {
        tr.insertCell();
      }
    }
    rootNode.innerHTML = "";
    rootNode.appendChild(table);
  }

  static paintGrid(gameController) {
    const table = document.getElementById(gridId);
    this.paintFood(gameController, table);
    this.paintSnake(gameController, table);
    if (gameController.isGameOver) {
      this.printGameOver()
    }
  }

  static printGameOver() {
    const rootNode = document.getElementById("root");
    const gameOver = document.createElement('p')
    gameOver.textContent = 'Game over'
    gameOver.classList.add('gameOver')
    rootNode.append(gameOver)
  }

  static paintFood(gameController, table) {
    const foodTd =
      table.rows[gameController.food.y].cells[gameController.food.x];
    foodTd.classList.add("food");
  }

  static paintSnake(gameController, table) {
    gameController.snake.state.forEach((item, index, array) => {
      const isSnakeHead = index === array.length - 1;
      const td = table.rows[item.y].cells[item.x];
      if (isSnakeHead) {
        td.classList.add("snakeHead");
      } else {
        td.classList.add("snakeBody");
      }
    });
  }
}

const game = new GameController(gridHeight, gridWidth);
GridRender.render(game);

document.addEventListener("keydown", (event) => {
  let direction;
  switch (event.key) {
    case "ArrowUp": {
      direction = "up";
      break;
    }
    case "ArrowDown": {
      direction = "down";
      break;
    }
    case "ArrowLeft": {
      direction = "left";
      break;
    }
    case "ArrowRight": {
      direction = "right";
      break;
    }
  }
  game.setDirection(direction);
});

const interval = setInterval(() => {
  game.updateState();
  GridRender.render(game);
  if (game.isGameOver) {
    window.clearInterval(interval)
  }
}, 500);
