import Game from './Game';

let game;

function init() {
  game = new Game(
    31,
    25,
    {
      x: 8,
      y: 11.5,
    },
    'green',
    {
      x: 1,
      y: 0,
    }
  );
  game.drawBgc();
  game.draw();
}

init();
