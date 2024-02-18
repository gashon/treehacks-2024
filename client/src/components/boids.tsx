import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";

const MAX_SPEED = 6;
const MIN_SPEED = 3;

const MAX_ACC = 0.3;
const MIN_ACC = 0;

const NUM_BOIDS = 120;
const MAX_NUM_BOIDS = 350;
const VALID_NEIGHBOR_RADIUS = 150;
const VEL_MATCHING_FACTOR = 0.025; //alignment

const AVOID_RADIUS = VALID_NEIGHBOR_RADIUS / 4;
const AVOID_FACTOR = 0.0005; //separation

const CENTERING_FACTOR = 0.0005; // cohesion

const TURN_FACTOR = 0.12;

const BORDER_MARGIN = 10;

const MOUSE_RADIUS = 180; //interaction
const MOUSE_FACTOR = 0.0005;

const ACCELERATION_DAMPING = 0.9;

interface ComponentProps {}
class Boid {
  public pos: p5Types.Vector;
  public vel: p5Types.Vector;
  public acc: p5Types.Vector;
  private neighbors: { neighbor: Boid; dist: number }[];

  constructor(xPos: number, yPos: number, p5: p5Types) {
    this.pos = p5.createVector(xPos, yPos);

    this.vel = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
    this.acc = p5.createVector(0);

    this.neighbors = [];
  }

  ensureValidSpeed() {
    let speed = this.vel.mag();
    if (speed > MAX_SPEED) {
      this.vel.setMag(MAX_SPEED);
    } else if (speed < MIN_SPEED) {
      this.vel.setMag(MIN_SPEED);
    }

    let acc = this.acc.mag();
    if (acc > MAX_ACC) {
      this.acc.setMag(MAX_ACC);
    } else if (acc < MIN_ACC) {
      this.acc.setMag(MIN_ACC);
    }
  }

  updateNeighbors(boids: Boid[]) {
    this.neighbors = [];
    for (const boid of boids) {
      const dist = this.pos.dist(boid.pos);

      if (dist < VALID_NEIGHBOR_RADIUS) {
        this.neighbors.push({ neighbor: boid, dist });
      }
    }
  }

  updateSeparation(p5: p5Types) {
    let closePos = p5.createVector(0);
    for (const { neighbor, dist } of this.neighbors) {
      if (dist < AVOID_RADIUS) {
        const diff = p5.createVector(
          this.pos.x - neighbor.pos.x,
          this.pos.y - neighbor.pos.y,
        );
        closePos = closePos.add(diff);
      }
    }

    this.vel.add(closePos.mult(AVOID_FACTOR));
    this.ensureValidSpeed();
  }

  updateAlignment(p5: p5Types) {
    // calculate the average heading of the flocking
    const validNeighbors = this.neighbors
      // .filter(({ dist }) => dist > AVOID_RADIUS)
      .map(({ neighbor }) => neighbor);

    const averageVelocity = this.calculateAverageVelocity(validNeighbors, p5);

    const diff = averageVelocity.sub(this.vel).mult(VEL_MATCHING_FACTOR);

    this.vel.add(diff);
    this.ensureValidSpeed();
  }

  updateCohesion(p5: p5Types) {
    let averagePos = p5.createVector(0);
    for (const { neighbor } of this.neighbors) {
      averagePos.add(neighbor.pos);
    }
    if (this.neighbors.length > 0) averagePos.div(this.neighbors.length);

    this.acc.add(
      averagePos.sub(this.pos).mult(CENTERING_FACTOR).mult(CENTERING_FACTOR),
    );
    this.ensureValidSpeed();
  }

  updateMouseInteraction(p5: p5Types) {
    const mouse = p5.createVector(p5.mouseX, p5.mouseY);
    const dist = mouse.dist(this.pos);

    if (dist < MOUSE_RADIUS) {
      this.acc.add(mouse.sub(this.pos).mult(MOUSE_FACTOR));
    }
  }

  calculateAverageVelocity(boids: Boid[], p5: p5Types) {
    let averageVelocity = p5.createVector(0);
    for (const neighbor of boids) {
      averageVelocity.add(neighbor.vel);
    }
    averageVelocity.div(boids.length);

    return averageVelocity;
  }

  render(p5: p5Types) {
    if (this.pos.x > document.body.clientWidth - BORDER_MARGIN)
      this.vel.x = this.vel.x - TURN_FACTOR;
    if (this.pos.x < BORDER_MARGIN) this.vel.x += TURN_FACTOR;

    if (this.pos.y > document.body.clientHeight - BORDER_MARGIN)
      this.vel.y -= TURN_FACTOR;
    if (this.pos.y < BORDER_MARGIN) this.vel.y += TURN_FACTOR;

    this.vel.add(this.acc);
    this.acc.mult(ACCELERATION_DAMPING);
    this.pos.add(this.vel);
    // p5.fill(0, 50);
    // p5.stroke(this.pos.x % 255, this.pos.y % 255, this.pos.x / 2 + 40, 50);
    p5.stroke(0, 50);
    p5.strokeWeight(1);
    p5.line(
      this.pos.x,
      this.pos.y,
      this.pos.x + this.vel.x * 2,
      this.pos.y + this.vel.y * 2,
    );
    // p5.ellipse(this.pos.x, this.pos.y, 10);

    // p5.noFill();
    // p5.stroke(0, 0, 0);
    // p5.strokeWeight(2);
    // p5.ellipse(this.pos.x, this.pos.y, VALID_NEIGHBOR_RADIUS);
    //
    // p5.stroke(255, 0, 0);
    // p5.ellipse(this.pos.x, this.pos.y, AVOID_RADIUS);
  }
}

const BoidsComponent: React.FC<ComponentProps> = (props: ComponentProps) => {
  const boids: Boid[] = new Array(NUM_BOIDS);
  let creationInterval: NodeJS.Timeout;

  // Setup function
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    let canvasWidth = document.body.clientWidth;
    let canvasHeight = document.body.clientHeight;

    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.strokeWeight(0);
    p5.fill(20);
    p5.stroke(10, 10, 10, 5);
    p5.background(255);
    p5.smooth();

    for (let i = 0; i < NUM_BOIDS; i++) {
      boids[i] = new Boid(
        p5.windowWidth / 2,
        p5.windowHeight / 2,
        // 0,
        // 0,
        // p5.random(0, p5.windowWidth / 2),
        // p5.random(0, p5.windowHeight / 2),
        p5,
      );
    }
  };

  // Draw function
  const draw = (p5: p5Types) => {
    p5.background(255, 70);

    for (const boid of boids) {
      boid.updateNeighbors(boids);

      boid.updateSeparation(p5);
      boid.updateAlignment(p5);
      boid.updateCohesion(p5);

      // boid.updateMouseInteraction(p5);

      boid.render(p5);
    }
  };

  const onMousePress = (p5: p5Types) => {
    creationInterval = setInterval(() => {
      if (boids.length > MAX_NUM_BOIDS) return;

      const newBoid = new Boid(p5.mouseX, p5.mouseY, p5);
      boids.push(newBoid);
    }, 50);
  };

  const onMouseRelease = () => {
    clearInterval(creationInterval);
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      // mousePressed={onMousePress}
      mouseReleased={onMouseRelease}
    />
  );
};

export default BoidsComponent;
