import { ctx } from './ui';

class Food {
  constructor(color, score, r, xAreas, yAreas, player) {
    this.coords = this.generateCoords(xAreas, yAreas, player);
    this.color = color;
    this.score = score;
    this.r = r;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  checkCoords(foodCoords, playerCoords) {
    return (
      Math.floor(foodCoords.x) === Math.floor(playerCoords.x) &&
      Math.floor(foodCoords.y) === Math.floor(playerCoords.y)
    );
  }

  generateCoords(xAreas, yAreas, player) {
    while (true) {
      let x = this.getRandomInt(0, xAreas);
      let y = this.getRandomInt(0, yAreas);
      let isCoordsSame = false;
      player.nodes.every((node) => {
        isCoordsSame = this.checkCoords(
          {
            x,
            y,
          },
          node.coords
        );
        if (isCoordsSame) return false;
        return true;
      });
      if (!isCoordsSame) {
        x += 0.5;
        y += 0.5;

        return {
          x,
          y,
        };
      }
    }
  }

  getScore() {
    const rnd = Math.random();
    if (rnd < 0.6) return 1;
    if (rnd < 0.9) return 2;
    return 5;
  }

  getColor() {
    switch (this.score) {
      case 1:
        return 'blue';
      case 2:
        return 'red';
      case 5:
        return 'gold';
      default:
        console.error('Something went wrong');
    }
    return 0;
  }

  update(xAreas, yAreas, player) {
    this.coords = this.generateCoords(xAreas, yAreas, player);
    this.score = this.getScore();
    this.color = this.getColor();
  }

  draw(areaSize) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.coords.x * areaSize, this.coords.y * areaSize, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Food;
