import { ctx, scoreDisplay } from './ui';
import Cell from './Cell';

class Player {
  constructor(startCoords, color, direction, width, areaSize, step, time) {
    this.startCoords = startCoords;
    this.color = color;
    this.startDirection = {
      ...direction,
    };
    this.direction = {
      ...direction,
    };
    this.width = width;
    this.areaSize = areaSize;
    this.step = step;
    this.time = time;
    this.nodes = this.generateNodes();
    this.score = 0;
    this.changeDirectionCoords = {
      ...direction,
    };
  }

  generateNodes() {
    const nodes = [];
    for (let i = 0; i < 6; i++) {
      const x = this.startCoords.x - i;
      const y = this.startCoords.y;
      nodes.push(
        new Cell(
          this.areaSize,
          this.width,
          {
            x,
            y,
          },
          {
            ...this.direction,
          },
          []
        )
      );
    }
    return nodes;
  }

  draw() {
    const head = this.nodes[0];
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    ctx.moveTo(head.coords.x * this.areaSize, head.coords.y * this.areaSize);
    for (let i = 0; i < this.nodes.length - 1; i++) {
      this.nodes[i].draw(this.nodes[i + 1].coords);
    }
    ctx.stroke();
  }

  update() {
    const currentTime = Date.now();
    if (currentTime - this.time >= 8) {
      this.time = currentTime;
      const head = this.nodes[0];
      head.headUpdate(this.direction, this.step);
      for (let i = 1; i < this.nodes.length; i++) {
        this.nodes[i].update(this.step);
      }
    }
  }

  changeDirection(newDirection) {
    if (
      Math.abs(this.direction.x) === Math.abs(newDirection.x) ||
      Math.abs(this.direction.y) === Math.abs(newDirection.y)
    ) {
      return;
    }
    const headCoords = this.nodes[0].coords;
    for (let i = 1; i < this.nodes.length; i++) {
      this.nodes[i].buffor.push({
        direction: {
          ...newDirection,
        },
        coords: {
          ...headCoords,
        },
      });
    }
    this.direction = newDirection;
  }

  eat(score) {
    for (let i = 0; i < score; i++) {
      const tail = this.nodes[this.nodes.length - 1];
      const coords = {
        ...tail.coords,
      };
      const buffor = [...tail.buffor];
      coords.x -= tail.direction.x;
      coords.y -= tail.direction.y;
      this.nodes.push(new Cell(tail.length, tail.width, coords, tail.direction, buffor));
    }

    this.score += score;
    scoreDisplay.textContent = this.score;
  }

  reset() {
    this.score = 0;
    this.direction = {
      ...this.startDirection,
    };
    this.nodes = this.generateNodes();
  }

  controller(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if event already handled
    }
    const headCoords = this.nodes[0].coords;
    if (
      Math.floor(headCoords.x) === Math.floor(this.changeDirectionCoords.x) &&
      Math.floor(headCoords.y) === Math.floor(this.changeDirectionCoords.y)
    ) {
      return;
    }
    this.changeDirectionCoords = {
      ...headCoords,
    };
    switch (event.code) {
      case 'KeyS':
      case 'ArrowDown':
        this.changeDirection({
          x: 0,
          y: 1,
        });
        break;
      case 'KeyW':
      case 'ArrowUp':
        this.changeDirection({
          x: 0,
          y: -1,
        });
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.changeDirection({
          x: -1,
          y: 0,
        });
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.changeDirection({
          x: 1,
          y: 0,
        });
        break;
      default:
        console.error('Something went wrong');
    }
    event.preventDefault();
  }
}

export default Player;
