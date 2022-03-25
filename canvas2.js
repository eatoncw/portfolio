const canvas = document.getElementById("2");
const HEIGHT = 600;
const WIDTH = window.innerWidth;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

let animatei = 0;
let flowI = 0;

class Circuit {
  constructor() {
    this.data = [];
    this.startX = 50;
    this.startY = 50;
    this.mapPath = {
      x: this.startX,
      y: this.startY,
    };
    this.direction = "right";
    this.flowMap = [];
    this.spark = {};
  }
  addElement(type, i) {
    let deviceType;
    this.mapCoords(deviceType);
    if (type === "battery") {
      deviceType = new Battery(this.mapPath.x, this.mapPath.y, this.direction);
    }
    if (type === "resistor")
      deviceType = new Resistor(this.mapPath.x, this.mapPath.y, this.direction);
    if (type === "connector")
      deviceType = new Connector(
        this.mapPath.x,
        this.mapPath.y,
        this.direction
      );
    this.data.push(deviceType);
  }
  getData() {
    return this.data;
  }
  mapCoords(type) {
    // start condition
    let currX = this.startX;
    let currY = this.startY;
    this.data.forEach((el) => {
      // console.log("off screen x", currX, WIDTH, currX > WIDTH);
      // console.log("el length", el.length);
      if (this.direction === "right") {
        currX += el.length;
        currY = this.mapPath.y;
      } else if (this.direction === "down") {
        currX = this.mapPath.x;
        if (el.direction === "down") currY += el.length;
      }
      console.log("currY", currY);
    });
    // console.log("off screen x", currX, WIDTH, currX > WIDTH);
    // console.log("currY", currY);
    if (currX + 100 + 50 > WIDTH) {
      if (this.direction === "right") {
        this.direction = "down";
      }
    }
    this.mapPath.x = currX;
    this.mapPath.y = currY;
  }
  draw() {
    for (let i = 0; i < this.getData().length; i++) {
      this.getData()[i].draw();
    }
  }
  mapCurrent() {
    this.data.forEach((el) => {
      el.paths.forEach((coords) => {
        this.flowMap.push(coords);
      });
    });
  }
  flow(i) {
    // get path from data;
    const { x, y } = this.flowMap[i];
    this.spark.x = x;
    this.spark.y = y;
    this.drawSpark();
  }
  drawSpark() {
    ctx.beginPath();
    ctx.arc(this.spark.x, this.spark.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
  animate() {
    window.requestAnimationFrame(() => this.animate());
    if (animatei % 10 === 0) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.draw();
      this.flow(flowI);
      if (flowI === this.flowMap.length - 1) {
        // reset
        flowI = 0;
      }
      flowI += 1;
    }
    animatei += 1;
  }
}

class Element {
  constructor(x = 10, y = 10, direction = "right") {
    Object.assign(this, { x, y, direction });
  }
}

class Connector extends Element {
  constructor(x = 10, y = 10, direction, length = 60) {
    super(x, y, direction);
    this.length = length;
    this.paths = [];
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    this.addPath(this.x, this.y);
    let x = 0;
    let y = 0;
    if (this.direction === "right") {
      x = this.x + this.length;
      y = this.y;
    } else if (this.direction === "down") {
      x = this.x;
      y = this.y + this.length;
    }
    ctx.lineTo(x, y);
    this.addPath(x, y);

    ctx.stroke();
    ctx.closePath();
  }
  addPath(x, y) {
    this.paths.push({ x, y });
  }
}

class Resistor extends Element {
  constructor(x, y, direction) {
    super(x, y, direction);
    this.straightSection = 10;
    this.height = 15;
    this.increment = 5;
    this.sections = 9;
    this.length = 60;
    this.paths = [];
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    if (this.direction === "right") {
      // straight line
      ctx.lineTo(this.x + this.straightSection, this.y);
      this.addPath(this.x + this.straightSection, this.y);
      // ctx.lineTo(this.x + 15, this.y + 15);
      // ctx.lineTo(this.x + 20, this.y - 15);
      // ctx.lineTo(this.x + 25, this.y + 15);
      // ctx.lineTo(this.x + 30, this.y - 15);
      // ctx.lineTo(this.x + 35, this.y + 15);
      // ctx.lineTo(this.x + 40, this.y - 15);
      // ctx.lineTo(this.x + 45, this.y);
      // ctx.lineTo(this.x + 55, this.y);

      for (let i = 0; i < this.sections - 2; i++) {
        const x = this.x + this.straightSection + (i + 1) * this.increment;
        const isLast = i + 1 === this.sections - 2;
        const y = isLast
          ? this.y
          : i % 2
          ? this.y + this.height
          : this.y - this.height;
        ctx.lineTo(x, y);
        this.addPath(x, y);
      }
      ctx.lineTo(
        this.x +
          this.straightSection * 2 +
          (this.sections - 1) * this.increment,
        this.y
      );
    } else if (this.direction === "down") {
      ctx.lineTo(this.x, this.y + this.straightSection);
      this.addPath(this.x, this.y + this.straightSection);
      ctx.lineTo(
        this.x - this.height,
        this.y + this.straightSection + this.increment * 1
      );
      this.addPath(
        this.x - this.height,
        this.y + this.straightSection + this.increment * 1
      );
      ctx.lineTo(this.x + this.height, this.y + 20);
      this.addPath(this.x + this.height, this.y + 20);
      ctx.lineTo(this.x - this.height, this.y + 25);
      this.addPath(this.x - this.height, this.y + 25);
      ctx.lineTo(this.x + this.height, this.y + 30);
      this.addPath(this.x + this.height, this.y + 30);
      ctx.lineTo(this.x - this.height, this.y + 35);
      this.addPath(this.x - this.height, this.y + 35);
      ctx.lineTo(this.x + this.height, this.y + 40);
      this.addPath(this.x + this.height, this.y + 40);
      ctx.lineTo(this.x, this.y + 45);
      this.addPath(this.x, this.y + 45);
      ctx.lineTo(this.x, this.y + 60);
      this.addPath(this.x, this.y + 60);
    }

    ctx.stroke();
  }
  addPath(x, y) {
    this.paths.push({ x, y });
  }
}

class Battery extends Element {
  constructor(x, y) {
    super(x, y);
  }
}

const els = [
  "resistor",
  "connector",
  "resistor",
  "connector",
  "resistor",
  "connector",
  "connector",
  "resistor",
  "resistor",
  "connector",
  "resistor",
  "connector",
  "resistor",
  "connector",
  "connector",
  "resistor",
  "connector",
  "resistor",
  "connector",
  "resistor",
  "connector",
  "connector",
  "resistor",
];
const circuit = new Circuit();
for (let i = 0; i < els.length; i++) {
  circuit.addElement(els[i]);
}

circuit.draw();

circuit.mapCurrent();
circuit.animate();

// function animate() {
//   window.requestAnimationFrame(animate);
//   ctx.clearRect(0, 0, window.innerWidth, HEIGHT);
//   circuit.flow();
// }

console.log(circuit);
