# FEW 1.2 - Class 4 - Cube Crush

## Learning Objectives

- Use JavaScript DOM methods to implement:
    - Mouse click events
    - Key press events
- Create a basic "game" with interaction & movement
- Explain why JS classes are useful in breaking up code into logical chunks
- Describe the attributes and behaviors of each class in the Cube Crush game

## JavaScript in the DOM

Let's make a new game! Candy Crush is the hottest game since 2012, and similar to its predecessor "Bejeweled", it has addicted millions of unsuspecting Millennials.

Before we dive into the starter code, let's do some review of how to use and manipulate the DOM using JavaScript.

### Why Use the DOM?

Discussion: Now that we've invested all of this energy into learning a video games framework, why might it be useful to make a game using only the DOM?

Here are a few possible benefits:
- It's simple and easy to get started with
- We can embed it into a DIV anywhere
- Skills we learn here are extensible to non-game projects!

### Let's Make The "Hello World" of Games

We're going to start off by doing a little review and flexing our DOM manipulation muscles! Start by copy and pasting the following starter code into `index.html`:

```
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <title>Hello Game World!</title>
    <style>
      #container {
        margin: 50px auto;
        position:relative;
        width: 500px;
        height: 500px;
        border: 1px solid #000;
      }

      .player {
        width: 50px;
        height: 50px;
        background-color: #000;
        position: relative;
        top: 225px;
        left: 225px;
      }
    </style>
  </head>
  <body>
    <div id=container></div>
    <script src="index.js"></script>
  </body>
</html>
```

You should now have an HTML page with an empty DIV that will serve as our game board. Open up your web page in the browser and check it out!

But we don't just want an empty game board; we want a little user interaction to happen here. Create the `index.js` file and insert the following code:

```
const container = document.getElementById('container');
const player = document.createElement('div');
player.classList.add('player');
container.appendChild(player);
```

Cool, we just made a player character! Now, how do we make it move? Let's add a click event. First, I just want to prove that the click event worked, so I'll have it change the color of our player.

```
container.addEventListener('click', (e) => {
  console.log(e);
  player.style['background-color'] = 'red';
});
```

Try it out in your browser. What happens when you click? What attributes does the click event object have that might be useful?

Here is the completed code to update the position of the player div:

```
const updatePlayer = function() {
  player.style.left = `${playerLoc.x}px`;
  player.style.top = `${playerLoc.y}px`;
};

container.addEventListener('click', (e) => {
  playerLoc = {x: e.offsetX, y: e.offsetY};
  updatePlayer();
});
```

Cool, so we now have mouse interaction! But what if we want keyboard interaction? Here's what that might look like. After you copy the code, try adding more keys!

```
document.addEventListener("keydown", (e) => {
  console.log(e);

  if (e.key === "ArrowUp") {
    playerLoc.y -= 10;
  } else if (e.key === "ArrowDown") {
    playerLoc.y += 10;
  }
  updatePlayer();
});
```

### Challenges

- Add another player that responds to different key presses.
- Add a non-player character, like the ball or bricks in Breakout, that has its own behavior.
- Create a new game mechanic! Change color, size, position, etc to respond to user input.

## JavaScript Classes

Another piece that is important to getting us started with Cube Crush is using classes in JavaScript. 

### Why use classes in JavaScript?

Discussion: Talk with your pair on the reasons why we may want to use JS classes.

### Cube Crush Classes

For each of the following classes in the Cube Crush game, describe the class's 1) attributes and 2) behavior.

- Game
- Board
- Square
- Score

### Finish the code to create & display squares

The Cube Crush game primarily consists of a 2D array of squares. How do we initialize and display the squares? 
