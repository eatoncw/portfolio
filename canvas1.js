const canvas = document.getElementById("1");
const HEIGHT = 600;
const WIDTH = window.innerWidth;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
// hoisted vars
let shapes;
let speedFactor;
let ricochet = false;
let shapeCount = 10;

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Shape {
  constructor(id, x, y, dx, dy, fill = Shape.randomFill()) {
    Object.assign(this, { x, y, dx, dy, fill, id });
  }
  static randomFill() {
    const r = randomNum(0, 255);
    const g = randomNum(0, 255);
    const b = randomNum(0, 255);
    const rgba = `rgba(${r},${g},${b},0.2)`;
    return rgba;
  }
}
class Triangle extends Shape {
  constructor(
    id,
    base = 15,
    height = 15,
    x = Math.random() * (window.innerWidth - base) + base,
    y = Math.random() * (HEIGHT - height) + height,
    dx = Math.random() - 0.5,
    dy = Math.random() - 0.5
  ) {
    super(id, x, y, dx, dy, "silver");
    Object.assign(this, { base, height });
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.base, this.y);
    ctx.lineTo(this.x + this.base / 2, this.y - this.height);
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  move() {
    let contact = false;
    // handle edges
    if (!contact) {
      if (this.x > window.innerWidth - this.base || this.x < this.base) {
        this.dx = -1 * this.dx;
      }
      if (this.y > HEIGHT - this.height || this.y < this.height) {
        this.dy = -1 * this.dy;
      }
    }

    this.x += this.dx * speedFactor;
    this.y += this.dy * speedFactor;
    this.draw();
  }
}

class Ball extends Shape {
  constructor(
    id,
    radius = 30,
    x = Math.random() * (window.innerWidth - radius * 2) + radius,
    y = Math.random() * (HEIGHT - radius * 2) + radius,
    dx = Math.random() - 0.5,
    dy = Math.random() - 0.5
  ) {
    super(id, x, y, dx, dy);
    Object.assign(this, { radius });
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  pop() {
    return shapes.removeBall(this.id);
  }
  move() {
    let contact = false;
    if (ricochet) {
      for (let i = 0; i < shapes.getBalls().length; i++) {
        if (shapes.getBall(i).id === this.id) continue;
        if (
          Math.abs(Math.floor(shapes.getBall(i).x - this.x)) <
            this.radius * 2 &&
          Math.abs(Math.floor(shapes.getBall(i).y - this.y)) < this.radius * 2
        ) {
          contact = true;
          // what is the direction of travel? stop them sticking
          this.dx = -1 * this.dx;
          this.dy = -1 * this.dy;
        }
      }
    }
    // handle edges
    if (!contact) {
      if (this.x > window.innerWidth - this.radius || this.x < this.radius) {
        this.dx = -1 * this.dx;
      }
      if (this.y > HEIGHT - this.radius || this.y < this.radius) {
        this.dy = -1 * this.dy;
      }
    }

    // pop

    for (let i = 0; i < shapes.getTriangles().length; i++) {
      const triangle = shapes.getTriangle(i);
      if (
        Math.abs(Math.floor(triangle.x - this.x)) < this.radius * 2 &&
        Math.abs(Math.floor(triangle.y - this.y)) < this.radius * 2
      ) {
        this.pop();
      }
    }
    this.x += this.dx * speedFactor;
    this.y += this.dy * speedFactor;
    this.draw();
  }
}

class Shapes {
  constructor() {
    this.data = {
      balls: [],
      triangles: [],
    };
  }
  addShape(shape = "ball", ...args) {
    if (shape === "ball") return this.addBall(...args);
    if (shape === "triangle") return this.addTriangle(...args);
  }
  addBall(id, ball) {
    if (!id) id = this.data.balls.length + 1;
    if (!ball) ball = new Ball(id);
    this.data.balls.push(ball);
    return this;
  }
  removeBall(id) {
    const ballIndex = this.data.balls.findIndex((ball) => ball.id === id);
    if (ballIndex !== -1) {
      this.data.balls.splice(ballIndex, 1);
    }
  }
  addTriangle(id, triangle) {
    if (!id) id = this.data.triangles.length + 1;
    if (!triangle) triangle = new Triangle(id);
    this.data.triangles.push(triangle);
    return this;
  }
  moveAll() {
    for (const shape in this.data) {
      this.data[shape].forEach((obj) => {
        obj.move();
      });
    }
  }
  getBall(i) {
    return this.data.balls[i];
  }
  getBalls() {
    return this.data.balls;
  }
  getTriangle(i) {
    return this.data.triangles[i];
  }
  getTriangles() {
    return this.data.triangles;
  }
}

const c = document.getElementById("canvas1");

function init() {
  var slider = document.getElementById("ball-speed");
  const button1 = document.getElementById("add-ball");
  button1.addEventListener("click", () => {
    shapes.addShape("ball");
  });

  const button2 = document.getElementById("bounce-off");
  button2.addEventListener("click", function () {
    ricochet = !ricochet;
    this.textContent = ricochet ? "balls" : "bubbles";
  });

  const button3 = document.getElementById("pop");
  button3.addEventListener("click", function () {
    shapes.addShape("triangle");
  });

  speedFactor = slider.value;

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    speedFactor = this.value;
  };
  shapes = new Shapes();
  // populate
  for (let i = 0; i < shapeCount; i++) {
    shapes.addShape("ball");
  }
}
init();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.clearRect(0, 0, window.innerWidth, HEIGHT);
  shapes.moveAll();
}

animate();
