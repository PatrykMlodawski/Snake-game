import { startButton, canvasBgc, ui, canvas, ctxBgc, ctx, endScore, scoreDisplay } from './ui';
import Player from './Player';
import Food from './Food';

class Game {
  constructor(xAreas, yAreas, startCoords, color, direction) {
    this.xAreas = xAreas;
    this.yAreas = yAreas;
    [this.width, this.height, this.areaSize] = this.setSize();
    this.player = this.makePlayer(startCoords, color, direction);
    this.food = this.makeFood();
    document.addEventListener('keydown', this.player.controller.bind(this.player), true);
    startButton.addEventListener('click', this.play);
  }

  makePlayer(headCoords, color, direction) {
    return new Player(
      headCoords,
      color,
      direction,
      this.areaSize - 4 * 0.05 * this.areaSize,
      this.areaSize,
      0.05,
      Date.now()
    );
  }

  makeFood() {
    return new Food(
      'blue',
      1,
      (this.areaSize - 0.3 * this.areaSize) / 2,
      this.xAreas - 2,
      this.yAreas - 2,
      this.player
    );
  }

  setSize() {
    const width = window.innerWidth / 2 - ((window.innerWidth / 2) % this.xAreas);
    const height = width - (width / this.xAreas) * (this.xAreas - this.yAreas);
    canvasBgc.width = width;
    canvasBgc.height = height;
    ui.style.width = `${width}px`;
    ui.style.height = `${height}px`;
    const areaSize = width / this.xAreas;
    canvas.width = width - 2 * areaSize;
    canvas.height = height - 2 * areaSize;
    return [width, height, areaSize];
  }

  drawBgc() {
    for (let i = 0; i < this.xAreas; i++) {
      for (let j = 0; j < this.yAreas; j++) {
        if (i === 0 || i === this.xAreas - 1 || j === 0 || j === this.yAreas - 1) {
          ctxBgc.fillStyle = 'rgb(64, 3, 3)';
        } else if ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) {
          ctxBgc.fillStyle = 'rgba(56, 66, 82, 1)';
        } else {
          ctxBgc.fillStyle = 'rgba(37, 43, 54, 1)';
        }
        ctxBgc.fillRect(i * this.areaSize, j * this.areaSize, this.areaSize, this.areaSize);
      }
    }
  }

  draw() {
    ctx.shadowColor = '#111';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 7;
    this.player.draw();
    this.food.draw(this.areaSize);
  }

  checkFoodCollision() {
    const headCoords = this.player.nodes[0].coords;
    const foodCoords = this.food.coords;
    if (
      Math.hypot(headCoords.x - foodCoords.x, headCoords.y - foodCoords.y) <=
      this.food.r / this.areaSize
    )
      return true;
    return false;
  }

  detectCollision() {
    const headCoords = this.player.nodes[0].coords;
    if (
      headCoords.x < 0 ||
      headCoords.x > this.xAreas - 2 ||
      headCoords.y < 0 ||
      headCoords.y > this.yAreas - 2
    )
      return true;
    const nodes = this.player.nodes;
    for (let i = 3; i < nodes.length; i++) {
      if (Math.hypot(headCoords.x - nodes[i].coords.x, headCoords.y - nodes[i].coords.y) < 0.5)
        return true;
    }
    return false;
  }

  animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.player.update();
    if (this.checkFoodCollision()) {
      this.player.eat(this.food.score);
      this.food.update(this.xAreas - 2, this.yAreas - 2, this.player);
    }
    this.draw();
    if (this.detectCollision()) {
      window.cancelAnimationFrame(this.animationId);
      endScore.textContent = this.player.score;
      this.player.reset();
      startButton.parentNode.classList.toggle('hide');
      return;
    }
    this.animationId = window.requestAnimationFrame(this.animate.bind(this));
  }

  play = (event) => {
    scoreDisplay.textContent = '0';
    event.target.parentNode.classList.toggle('hide');
    this.food = this.makeFood();
    this.animate();
  };
}

export default Game;
