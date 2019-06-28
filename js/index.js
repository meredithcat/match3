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
    this.score = new Score();
    this.playArea.setOnclick((e) => this.handleClick(e));
    this.initSquares();

    this.clickedSquare = undefined;
  }

  initSquares() {
    this.squares = [];
    for (let r = 0; r < Game.ROWS; r++){
      this.squares[r] = [];
      for (let c = 0; c < Game.COLS; c++) {
        this.squares[r][c] = new Square(this.playArea, c * Game.SQUARE_WIDTH, -Game.SQUARE_HEIGHT);
      }
    }
    this.removeMatches(true);
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
      this.draw();
      
	    setTimeout(this.removeMatches.bind(this), 1000);

      // TODO: if it doesn't result in a streak, undo
    } else {
      square1Obj.toggle();
      square2Obj.toggle();
    }
  }

  findMatches() {
    let squaresToRemove = [];
    let removeSquares = (sqs) => {
      sqs.forEach((sq) => {
        if (!squaresToRemove.some((sq2) => sq2.row === sq.row && sq2.col === sq.col)) {
          squaresToRemove.push(sq);
        }
      });
    }

    // remove horizontal
    for (let r = 0; r < Game.ROWS; r++) {
      for (let c = 0; c < Game.COLS - 2; c++) {
        if (this.squares[r][c+1].color === this.squares[r][c].color && 
            this.squares[r][c].color === this.squares[r][c+2].color) {
          removeSquares([{row: r, col: c}, {row: r, col: c+1}, {row: r, col: c+2}]);
          while (c+3 < Game.COLS && this.squares[r][c+3].color === this.squares[r][c].color) {
            removeSquares([{row: r, col: c+3}]);
            c++;
          }
        }
      }
    }

    // remove vertical
    for (let c = 0; c < Game.COLS; c++) {
      for (let r = 0; r < Game.ROWS - 2; r++) {
        if (this.squares[r+1][c].color === this.squares[r][c].color && 
            this.squares[r+2][c].color === this.squares[r][c].color) {
          removeSquares([{row: r, col: c}, {row: r+1, col: c}, {row: r+2, col: c}]);
          while (r+3 < Game.ROWS && this.squares[r+3][c].color === this.squares[r][c].color) {
            removeSquares([{row: r+3, col: c}]);
            r++;
          }
        }
      }
    }

    return squaresToRemove;
  }

  removeMatches(skipAnimation) {
    let squaresToRemove = this.findMatches();

    squaresToRemove.forEach((sq) => {
      let square = this.squares[sq.row][sq.col];
      square.remove(this.playArea, skipAnimation);
      this.squares[sq.row][sq.col] = undefined;
    });

    if (squaresToRemove.length > 0) {
      if (skipAnimation) {
        this.applyGravity(true);
      } else {
        this.score.increase(squaresToRemove.length);
        setTimeout(this.applyGravity.bind(this), 1000);
      }
    }
  }

  applyGravity(skipAnimation) {
    for (let c = 0; c < Game.COLS; c++) {
      for (let r = Game.ROWS - 1; r >= 0; r--) {
        if (this.squares[r][c] === undefined) {
          // go up until find square
          let r2 = r;
          while (r2 >= 0 && this.squares[r2][c] === undefined) {
            r2--;
          }
          if (r2 >= 0) {
            this.squares[r][c] = this.squares[r2][c];
            this.squares[r2][c] = undefined;
          } else {
            this.squares[r][c] = new Square(this.playArea, c * Game.SQUARE_WIDTH, -Game.SQUARE_HEIGHT);
          }
        }
      }
    }
    this.draw();
    if (skipAnimation) {
      this.removeMatches(true);
    } else {
      setTimeout(this.removeMatches.bind(this), 1000);
    }
  }

  draw() {
    for (let r = 0; r < Game.ROWS; r++){
      for (let c = 0; c < Game.COLS; c++) {
        this.squares[r][c].draw(c * Game.SQUARE_WIDTH, r * Game.SQUARE_HEIGHT);
      }
    }
    this.score.draw();
  }
}

class PlayArea {
  constructor() {
    const container = document.getElementById('container');
    this.domElement = document.createElement('div');
    container.appendChild(this.domElement);
    this.domElement.classList.add('playArea');
    const width = Game.ROWS * Game.SQUARE_WIDTH + Game.MARGIN;
    const height = Game.COLS * Game.SQUARE_HEIGHT + Game.MARGIN;
    applyCSS(this.domElement, {
      width: `${width}px`,
      height: `${height}px`,
    });
  }

  appendChild(elem) {
    this.domElement.appendChild(elem);
  }

  removeChild(elem) {
    this.domElement.removeChild(elem);
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
  constructor(playArea, x, y) {
    this.color = Square.colors[Math.floor(Math.random() * Square.colors.length)];

    this.domElement = document.createElement('div');
    playArea.appendChild(this.domElement);
    this.domElement.classList.add('square');
    applyCSS(this.domElement, {
      left: `${x}px`,
      top: `${y}px`,
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


  remove(playArea, skipAnimation) {
    if (skipAnimation) {
      playArea.removeChild(this.domElement);
    } else {
      this.domElement.classList.add('disappear');
      this.domElement.addEventListener('animationend',  (function() {
        playArea.removeChild(this.domElement); 
      }).bind(this));
    }
  }

  draw(x, y) {
    setTimeout((function() {
      this.domElement.style.left = `${x}px`;
      this.domElement.style.top = `${y}px`;
    }).bind(this), 50);
  }
}

class Score {
  constructor() {
    this.domElement = document.getElementById('score');
    this.score = 0;
  }

  increase(amt) {
    this.score += amt;
    this.draw();
  }

  draw() {
    this.domElement.innerHTML = this.score;
  }
}

let game = new Game();
game.draw();


//game.draw();