/* 
 * Helper function to apply multiple styles at once.
 * From https://j11y.io/javascript/javascript-bad-practices/
 */
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
  // Static variables, to be used throughout the program. Can be referenced as
  // e.g. Game.ROWS.
  static ROWS = 10; // number of rows in the game
  static COLS = 10; // number of columns in the game
  static SQUARE_WIDTH = 50; // width of square in pixels
  static SQUARE_HEIGHT = 50; // height of square in pixels
  static MARGIN = 10; // number of pixels in between squares

  constructor() {
    this.board = new Board();
    this.score = new Score();
    this.squares = [];
    this.clickedSquare = undefined; // The square last clicked

    this.initSquares();
  }

  /**
   * Initialize the game's array of squares.
   * 
   * Postcondition: `this.squares` should contain a 2D array of Square objects.
   */
  initSquares() {
    for (let row = 0; row < Game.ROWS; row++){
      this.squares[row] = [];
      for (let col = 0; col < Game.COLS; col++) {
        this.squares[row][col] = new Square(
            this.board, row, col, this.handleClick.bind(this));
      }
    }

    // Remove any matches that happen to be in the starting board (but don't show animations).
    this.removeMatches(true /* skipAnimations */);
  }

  /**
   * Click handler for when a square is clicked.
   * 
   * @param {Square} square The clicked Square object.
   */
  handleClick(square) {
    return () => {
      if (this.clickedSquare === undefined) {
        this.clickedSquare = square;
      } else /* if this.clickedSquare exists */ {
        this.maybeSwap(this.clickedSquare, square);
        this.clickedSquare = undefined;
      }
    };
  }

  /**
   * Draw all components.
   */
  draw() {
    for (let row = 0; row < Game.ROWS; row++){
      for (let col = 0; col < Game.COLS; col++) {
        this.squares[row][col].draw();
      }
    }
    this.score.draw();
  }

  /**
   * Either swap the 2 given squares, or indicate that they cannot be swapped 
   * because they are not adjacent.
   * 
   * @param {Square} square1 the 1st square
   * @param {Square} square2 the 2nd square
   */
  maybeSwap(square1, square2) {
    /*
     * TODO IN PART 2: Fill in the missing code. 
     */
    const isAdjacentHoriz = square1.row === square2.row &&
        Math.abs(square1.col - square2.col) === 1;
    const isAdjacentVert = square1.col === square2.col && 
        Math.abs(square1.row - square2.row) === 1;

    if (isAdjacentHoriz || isAdjacentVert) { // If it is a valid swap
      // Swap the squares in the 2D array
      this.squares[square1.row][square1.col] = square2;
      this.squares[square2.row][square2.col] = square1;

      // Swap the squares' row and col variables
      let square1Loc = {row: square1.row, col: square1.col};
      square1.setLocation(square2.row, square2.col);
      square2.setLocation(square1Loc.row, square1Loc.col);

      this.draw();
	    setTimeout(this.removeMatches.bind(this), 1000);

      /* OPTIONAL TODO: If the swap didn't result in a match, undo the swap. */

    } else { // If it is an invalid swap
      square1.toggle();
      square2.toggle();
    }
  }

  /**
   * Return an array of Square objects to be removed from the grid. The returned array should not
   * contain any duplicates.
   * 
   * This method should not cause side effects.
   * 
   * @return The squares to be removed.
   */
  getMatches() {
    const matches = [];

    /**
     * Helper method to add multiple squares to the `matches` array. Can be used as
     *   addMatches(sq1);
     * or
     *   addMatches(sq1, sq2, sq3);
     * 
     * @param {Array<Square>} squares 
     */
    const addMatches = (...squares) => {
      squares.forEach((square) => {
        if (!matches.includes(square)) {
          matches.push(square);
        }
      });
    }

    /*
     * TODO IN PART 2: Fill in the missing code.
     *
     * HINT: Split up your code to find horizontal matches in each row, then vertical matches in
     * each column.
     */

    // Find horizontal matches
    for (let row = 0; row < Game.ROWS; row++) {
      for (let col = 0; col < Game.COLS - 2; col++) {
        // If at least 3 in a row
        if (this.squares[row][col+1].color === this.squares[row][col].color && 
            this.squares[row][col].color === this.squares[row][col+2].color) {
          addMatches(this.squares[row][col], this.squares[row][col+1], this.squares[row][col+2]);
          // Add the rest of same colored squares
          while (col+3 < Game.COLS && 
              this.squares[row][col+3].color === this.squares[row][col].color) {
            addMatches(this.squares[row][col+3]);
            col++;
          }
        }
      }
    }

    // Find vertical matches
    for (let col = 0; col < Game.COLS; col++) {
      for (let row = 0; row < Game.ROWS - 2; row++) {
        // If at least 3 in a row
        if (this.squares[row+1][col].color === this.squares[row][col].color && 
            this.squares[row+2][col].color === this.squares[row][col].color) {
          addMatches(this.squares[row][col], this.squares[row+1][col], this.squares[row+2][col]);
          // Add the rest of same colored squares
          while (row+3 < Game.ROWS && this.squares[row+3][col].color === this.squares[row][col].color) {
            addMatches(this.squares[row+3][col]);
            row++;
          }
        }
      }
    }

    return matches;
  }

  /**
   * Remove all matched squares from the grid. This method should call the 
   * `getMatches` helper function.
   * 
   * @param {boolean} skipAnimations If true, do not display animations or
   *   increase the score.
   */
  removeMatches(skipAnimations) {
    const squaresToRemove = this.getMatches();

    /*
     * TODO IN PART 2: Fill in the missing code.
     */
    squaresToRemove.forEach((square) => {
      square.remove(this.board, skipAnimations);
      this.squares[square.row][square.col] = undefined;
    });

    if (squaresToRemove.length > 0) {
      if (skipAnimations) {
        this.applyGravity(true /* skipAnimations */);
      } else {
        this.score.increase(squaresToRemove.length);
        setTimeout(this.applyGravity.bind(this), 1000);
      }
    }
  }

  /**
   * Make existing squares descend to their new location, and fill any remaining
   * spots with new Square objects.
   * 
   * @param {boolean} skipAnimations If true, do not display animations or
   *   increase the score.
   */
  applyGravity(skipAnimations) {
    /*
     * TODO IN PART 3: Fill in the missing code.
     *
     * HINT: After inserting new squares, this method should recursively call
     * `removeMatches`.
     */
    for (let col = 0; col < Game.COLS; col++) {
      for (let row = Game.ROWS - 1; row >= 0; row--) {
        if (this.squares[row][col] === undefined) {
          // Go up until we find non-null square, then move it down
          let row2 = row;
          while (row2 >= 0 && this.squares[row2][col] === undefined) {
            row2--;
          }
          if (row2 >= 0) {
            this.squares[row][col] = this.squares[row2][col];
            this.squares[row][col].setLocation(row, col);
            this.squares[row2][col] = undefined;
          } else {
            this.squares[row][col] = new Square(this.board, row, col, this.handleClick.bind(this));
          }
        }
      }
    }
    this.draw();

    // Recursively remove the next set of matches.
    if (skipAnimations) {
      this.removeMatches(true /* skipAnimations */);
    } else {
      setTimeout(this.removeMatches.bind(this), 1000);
    }
  }
}

/**
 * Board class. Contains the `board` DOM element and handles its DOM interactions.
 */
class Board {
  constructor() {
    const container = document.getElementById('container');
    this.domElement = document.createElement('div');
    container.appendChild(this.domElement);
    this.domElement.classList.add('board');
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
}

/**
 * Square class. Includes all relevant data for a single square.
 */
class Square {
  static colors = [
    '#ff0066', // pink
    '#ff6600', // orange
    '#cc33ff', // purple
    '#0066ff', // blue
    '#00ff00', // green
    '#ffff00', // yellow
  ];

  /**
   * Constructor for the Square class.
   * 
   * @param {Board} board The board object.
   * @param {number} row The square's initial row
   * @param {number} col The square's initial column
   * @param {function} handleClick A callback function which takes in a Square object, to be called
   *   when a square is clicked.
   */
  constructor(board, row, col, handleClick) {
    this.color = Square.colors[
      Math.floor(Math.random() * Square.colors.length)];
    this.row = row;
    this.col = col;

    this.domElement = document.createElement('div');
    board.appendChild(this.domElement);
    this.domElement.classList.add('square');
    applyCSS(this.domElement, {
      left: `${this.col * Game.SQUARE_WIDTH}px`,
      top: `${-Game.SQUARE_HEIGHT}px`,
      width: `${Game.SQUARE_WIDTH-Game.MARGIN}px`,
      height: `${Game.SQUARE_HEIGHT-Game.MARGIN}px`,
      background: this.color,
    });
    this.domElement.addEventListener("click", handleClick(this));
  }

  /**
   * Draw the Square by updating any changed fields.
   */
  draw() {
    setTimeout((function() {
      applyCSS(this.domElement, {
        left: `${this.col * Game.SQUARE_WIDTH}px`,
        top: `${this.row * Game.SQUARE_HEIGHT}px`,
      });
    }).bind(this), 50);
  }

  /**
   * Updates the square's location to a new row and column.
   * 
   * @param {number} row The square's new row
   * @param {number} col The square's new column
   */
  setLocation(row, col) {
    this.row = row;
    this.col = col;
  }

  /**
   * Animate the square after it was involved in an invalid swap.
   */
  toggle() {
    this.domElement.classList.add('toggle');
    this.domElement.addEventListener('animationend',  (function() {
      this.domElement.classList.remove('toggle');    
    }).bind(this));
  }

  /**
   * Remove the square from the DOM and optionally animate it prior to doing so.
   *
   * @param {Board} board 
   * @param {boolean} skipAnimations 
   */
  remove(board, skipAnimations) {
    if (skipAnimations) {
      board.removeChild(this.domElement);
    } else {
      this.domElement.classList.add('disappear');
      this.domElement.addEventListener('animationend',  (function() {
        board.removeChild(this.domElement); 
      }).bind(this));
    }
  }
}

/**
 * Keeps track of the game score and updates the score DOM element.
 */
class Score {
  constructor() {
    this.domElement = document.getElementById('score');
    this.score = 0;
  }

  /**
   * Increase the score by a set number of points.
   * 
   * @param {number} amount 
   */
  increase(amount) {
    this.score += amount;
    this.draw();
  }

  draw() {
    this.domElement.innerHTML = this.score;
  }
}

const game = new Game();
game.draw();
