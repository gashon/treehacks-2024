import React from "react";
import Sketch from "react-p5";
import p5Types, { Vector } from "p5";

interface ComponentProps {
  // Define any props your component might use
}

interface Bob {
  lastPos: Vector;
  pos: Vector;
  vel: Vector;
  acc: Vector;
  drag: number;
  hue: number;
  bright: number;
  move: () => void;
}

const YourComponent: React.FC<ComponentProps> = (props: ComponentProps) => {
  const bobCount = 3000;
  let bobs: Bob[] = [];
  let globalHue: number;

  // Setup function: initializes the canvas and particles
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    // p5.colorMode(p5.HSB, 255);
    reset(p5);
  };

  // Draw function: updates and draws particles each frame
  const draw = (p5: p5Types) => {
    p5.background(250);
    bobs.forEach((bob) => {
      bob.move();
      p5.stroke(20, 80);
      let newPos = bob.pos.copy();
      newPos.sub(bob.lastPos);
      newPos.mult(15);
      newPos.add(bob.pos);
      p5.line(newPos.x, newPos.y, bob.pos.x, bob.pos.y);
    });
  };

  // Reset function: initializes the particles and background
  const reset = (p5: p5Types) => {
    globalHue = p5.random(255);
    bobs = [];
    for (let i = 0; i < bobCount; i++) {
      bobs.push(newBob(p5, p5.random(p5.width), p5.random(p5.height)));
    }
    // Avoid immediate mouse interaction
    p5.mouseX = -9999;
    p5.mouseY = -9999;
    p5.background(250);
  };

  // Factory function for creating a new Bob instance
  const newBob = (p5: p5Types, x: number, y: number): Bob => {
    const bob: Bob = {
      lastPos: p5.createVector(x, y),
      pos: p5.createVector(x, y),
      vel: p5.createVector(0, 0),
      acc: p5.createVector(0, 0),
      drag: p5.random(0.98, 0.99),
      hue: (globalHue + p5.random(-40, 40)) % 255,
      bright: p5.random(255),
      move: function () {
        this.lastPos.x = this.pos.x;
        this.lastPos.y = this.pos.y;
        this.vel.mult(this.drag);

        // Repel from or attract to the mouse based on button state
        let mouseDist = p5.dist(this.pos.x, this.pos.y, p5.mouseX, p5.mouseY);
        let mouseThresh = 300;
        let mult = 0.001;
        if (p5.mouseIsPressed && p5.mouseButton === p5.CENTER) {
          mult *= -1;
        }
        if (mouseDist < mouseThresh) {
          let push = p5.createVector(this.pos.x, this.pos.y);
          push.sub(p5.createVector(p5.mouseX, p5.mouseY));
          push.normalize();
          push.mult((mouseThresh - mouseDist) * mult);
          this.acc.add(push);
        }

        // Update position and velocity
        this.vel.add(this.acc);
        this.vel.limit(6);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // Wrap around the edges
        if (this.pos.x < 0) {
          this.pos.x = p5.width;
          this.lastPos.x = p5.width;
        } else if (this.pos.x > p5.width) {
          this.pos.x = 0;
          this.lastPos.x = 0;
        }
        if (this.pos.y < 0) {
          this.pos.y = p5.height;
          this.lastPos.y = p5.height;
        } else if (this.pos.y > p5.height) {
          this.pos.y = 0;
          this.lastPos.y = 0;
        }
      },
    };

    bob.vel.mult(p5.random(0.1));
    return bob;
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default YourComponent;
