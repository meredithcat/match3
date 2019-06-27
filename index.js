
/* from https://j11y.io/javascript/javascript-bad-practices/ */
function applyCSS(el, styles) {
  for (var prop in styles) {
      if (!styles.hasOwnProperty || styles.hasOwnProperty(prop)) {
          el.style[prop] = styles[prop];
      }
  }
  return el;
}

/**
 * Game class.
 */
class Game {
  static ROWS = 10;
  static COLS = 10;
  static SQUARE_WIDTH = 50;
  static SQUARE_HEIGHT = 50;
  static MARGIN = 10;
  constructor() {
    this.playArea = new PlayArea();
    this.playArea.setOnclick((e) => this.handleClick(e));
    this.initSquares();

    this.clickedSquare = undefined;
  }

  initSquares() {
    this.squares = [];
    for (let r = 0; r < Game.ROWS; r++){
      this.squares[r] = [];
      for (let c = 0; c < Game.COLS; c++) {
        this.squares[r][c] = new Square(this.playArea);
      }
    }
  }

  handleClick(e) {
    if (e.srcElement.className === 'square'){
      // kind of a hack - better way?
      const row = Math.floor(e.srcElement.offsetTop / Game.SQUARE_HEIGHT);
      const col = Math.floor(e.srcElement.offsetLeft / Game.SQUARE_WIDTH);
      if (!this.clickedSquare) {
        this.clickedSquare = {row, col};
      } else /* if this.clickedSquare */ {
        this.maybeSwap(this.clickedSquare, {row, col});
        this.clickedSquare = undefined;
      }
    }
  }

  maybeSwap(square1, square2) {
    const square1Obj = this.squares[square1.row][square1.col];
    const square2Obj = this.squares[square2.row][square2.col];

    const adjHoriz = 
      square1.row === square2.row && 
      Math.abs(square1.col - square2.col) === 1;
    const adjVert =
      square1.col === square2.col && 
      Math.abs(square1.row - square2.row) === 1;

    if (adjVert || adjHoriz) {
      this.squares[square1.row][square1.col] = square2Obj;
      this.squares[square2.row][square2.col] = square1Obj;
      this.removeMatches();
      this.draw();

      // TODO: if it doesn't result in a streak, undo
    } else {
      square1Obj.toggle();
      square2Obj.toggle();
    }
  }

  removeMatches() {
    // TODO: remove horizontal

    // TODO: remove vertical
  }

  draw() {
    for (let r = 0; r < Game.ROWS; r++){
      for (let c = 0; c < Game.COLS; c++) {
        this.squares[r][c].draw(c * Game.SQUARE_WIDTH, r * Game.SQUARE_HEIGHT);
      }
    }
  }
}

class PlayArea {
  constructor() {
    this.domElement = document.createElement('div');
    document.body.appendChild(this.domElement);
    this.domElement.classList.add('playArea');
    const width = Game.ROWS * Game.SQUARE_WIDTH + Game.MARGIN;
    const height = Game.COLS * Game.SQUARE_HEIGHT + Game.MARGIN;
    applyCSS(this.domElement, {
      width: `${width}px`,
      height: `${height}px`
    });
  }

  appendChild(elem) {
    this.domElement.appendChild(elem);
  }

  setOnclick(handler) {
    this.domElement.addEventListener("click", handler);
  }
}

class Square {
  static colors = [
    '#ff0066', // pink
    '#ff6600', // orange
    '#cc33ff', // purple
    '#0066ff', // blue
    '#00ff00', // green
    '#ffff00', // yellow
  ];
  constructor(playArea) {
    this.color = Square.colors[Math.floor(Math.random() * Square.colors.length)];

    this.domElement = document.createElement('div');
    playArea.appendChild(this.domElement);
    this.domElement.classList.add('square');
    applyCSS(this.domElement, {
      width: `${Game.SQUARE_WIDTH-Game.MARGIN}px`,
      height: `${Game.SQUARE_HEIGHT-Game.MARGIN}px`,
      background: this.color,
    });
  }

  toggle() {
    this.domElement.classList.add('toggle');
    this.domElement.addEventListener('animationend',  (function() {
      this.domElement.classList.remove('toggle');    
    }).bind(this));
  }

  draw(x, y) {
    this.domElement.style.left = `${x}px`;
    this.domElement.style.top = `${y}px`;
  }
}

let game = new Game();
game.draw();


//game.draw();