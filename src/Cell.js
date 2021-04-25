import { ctx } from './ui';

class Cell {
  constructor(length, width, coords, direction, buffor) {
    this.length = length;
    this.width = width;
    this.coords = coords;
    this.direction = direction;
    this.buffor = buffor;
  }

  draw(nextCoords) {
    ctx.lineTo(nextCoords.x * this.length, nextCoords.y * this.length);
  }

  turnLeft() {
    [this.direction.x, this.direction.y] = [this.direction.y, -this.direction.x];
  }

  turnRight() {
    [this.direction.x, this.direction.y] = [-this.direction.y, this.direction.x];
  }

  headUpdate(nextDirection, step) {
    if (this.direction.x !== nextDirection.x || this.direction.y !== nextDirection.y) {
      if (this.direction.y === 0) {
        const distance = ((this.direction.x * this.coords.x) % 1) - this.direction.x * 0.5;
        if (distance <= 0.5 && distance >= 0) {
          this.coords.x = Math.floor(this.coords.x) + 0.5;
          this.coords.y += nextDirection.y * distance;
          this.direction.x - nextDirection.y === 0 ? this.turnRight() : this.turnLeft();
        }
      } else {
        const distance = ((this.direction.y * this.coords.y) % 1) - this.direction.y * 0.5;

        if (distance <= 0.5 && distance >= 0) {
          this.coords.y = Math.floor(this.coords.y) + 0.5;
          this.coords.x += +nextDirection.x * distance;
          -this.direction.y - nextDirection.x === 0 ? this.turnRight() : this.turnLeft();
        }
      }
    }
    this.coords.x += step * this.direction.x;
    this.coords.y += step * this.direction.y;
  }

  update(step) {
    this.coords.x += step * this.direction.x;
    this.coords.y += step * this.direction.y;
    if (this.buffor.length > 0) {
      if (
        Math.abs(this.coords.x - (Math.floor(this.buffor[0].coords.x) + 0.5)) < 0.000001 &&
        Math.abs(this.coords.y - (Math.floor(this.buffor[0].coords.y) + 0.5)) < 0.000001
      ) {
        this.direction = this.buffor.shift().direction;
        this.coords.x = Math.floor(this.coords.x) + 0.5;
        this.coords.y = Math.floor(this.coords.y) + 0.5;
      }
    }
  }
}

export default Cell;
