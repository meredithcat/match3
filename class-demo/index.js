const container = document.getElementById('container');

const player = document.createElement('div');
container.appendChild(player);
player.classList.add('player');

let playerLoc = {
  x: 250,
  y: 250,
};

container.addEventListener('click', (e) => {
  console.log(e);
  player.style['background-color'] = 'blue';
  player.style.left = `${e.offsetX}px`;
  player.style.top = `${e.offsetY}px`;

  playerLoc = {x: e.offsetX, y: e.offsetY};
});

document.addEventListener("keydown", (e) => {
  console.log(e);

  if (e.key === "ArrowUp") {
    playerLoc.y -= 10;
    player.style.top = `${thingyLoc.y}px`;
  } else if (e.key === "ArrowDown") {
    playerLoc.y += 10;
    player.style.top = `${thingyLoc.y}px`;
  }
});