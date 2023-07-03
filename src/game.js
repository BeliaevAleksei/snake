"use strict";

// 10 x 10

// x1,y1 x2,y1...
// x1,y2 x2,y2...
// 0 0 0 0 0 0 0 0 0
// ...
// 5row, 4,5,6 elem

const DIRECTION = Object.freeze({
  RIGHT: Symbol("RIGHT"),
  LEFT: Symbol("LEFT"),
  UP: Symbol("UP"),
  DOWN: Symbol("DOWN"),
});

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
    return (
      coordinate.x >= this.width ||
      coordinate.y >= this.height ||
      coordinate.y < 0 ||
      coordinate.x < 0
    );
  }
}

class Snake {
  /**
   * @param {*} gameField game field info
   * @param {*} direction up, down, right, left
   */
  constructor(gameField, direction) {
    this.gameField = gameField;
    this.direction = direction;
    this.nextDirection = direction;
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
  isReverseDirection(direction) {
    if (direction === DIRECTION.DOWN) {
      return this.direction === DIRECTION.UP;
    }
    if (direction === DIRECTION.UP) {
      return this.direction === DIRECTION.DOWN;
    }
    if (direction === DIRECTION.LEFT) {
      return this.direction === DIRECTION.RIGHT;
    }
    if (direction === DIRECTION.RIGHT) {
      return this.direction === DIRECTION.LEFT;
    }
  }
  getNextCoordinate() {
    let nextCoordinate;
    const headCoordinate = this.state[this.state.length - 1];
    switch (this.nextDirection) {
      case DIRECTION.RIGHT: {
        nextCoordinate = new Coordinate(headCoordinate.x + 1, headCoordinate.y);
        break;
      }
      case DIRECTION.LEFT: {
        nextCoordinate = new Coordinate(headCoordinate.x - 1, headCoordinate.y);
        break;
      }
      case DIRECTION.UP: {
        nextCoordinate = new Coordinate(headCoordinate.x, headCoordinate.y - 1);
        break;
      }
      case DIRECTION.DOWN: {
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
  move() {
    const nextCoordinate = this.getNextCoordinate(this.direction);

    if (this.canGoCoordinate(nextCoordinate)) {
      this.state.shift();
      this.state.push(nextCoordinate);
      return true;
    }
    return false;
  }
  canGoDirection(direction) {
    return !this.isReverseDirection(direction);
  }
  canGoCoordinate(coordinate) {
    if (!this.isSnakeCoordinate(coordinate)) {
      return true;
    }
    return false;
  }
  setNewDirection(direction) {
    this.nextDirection = direction;
  }
  updateDirection() {
    this.direction = this.nextDirection;
  }
  add() {
    const nextCoordinate = this.getNextCoordinate(this.direction);

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
    this.gridField = new Grid(gridHeight, gridWidth);
    this.snake = new Snake(this.gridField, DIRECTION.RIGHT);
    this.food = this.getFoodPosition();
    this.isGameOver = false;
  }

  setDirection(direction) {
    if (this.snake.canGoDirection(direction)) {
      this.snake.setNewDirection(direction);
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
    const nextCoordinate = this.snake.getNextCoordinate();
    if (
      this.snake.isSnakeCoordinate(nextCoordinate) ||
      this.gridField.isOutOfGrid(nextCoordinate)
    ) {
      this.isGameOver = true;
      return;
    }
    this.snake.updateDirection();
    if (this.food.isEqual(nextCoordinate)) {
      this.snake.add();
      this.food = this.getFoodPosition();
    } else {
      this.snake.move();
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
      this.printGameOver();
    }
  }

  static printGameOver() {
    const rootNode = document.getElementById("root");
    const gameOver = document.createElement("p");
    gameOver.textContent = "Game over";
    gameOver.classList.add("gameOver");
    rootNode.append(gameOver);
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

export function startGame() {
  const game = new GameController(gridHeight, gridWidth);
  GridRender.render(game);

  document.addEventListener("keydown", (event) => {
    let direction;
    switch (event.key) {
      case "ArrowUp": {
        direction = DIRECTION.UP;
        break;
      }
      case "ArrowDown": {
        direction = DIRECTION.DOWN;
        break;
      }
      case "ArrowLeft": {
        direction = DIRECTION.LEFT;
        break;
      }
      case "ArrowRight": {
        direction = DIRECTION.RIGHT;
        break;
      }
    }
    game.setDirection(direction);
  });

  const interval = setInterval(() => {
    game.updateState();
    GridRender.render(game);
    if (game.isGameOver) {
      window.clearInterval(interval);
    }
  }, 500);
}
