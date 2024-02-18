import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types, { Vector } from "p5";

interface Point {
  pos: Vector;
  init_position: Vector;
  v: Vector;
  spawn_pos: Vector;
  color_: p5Types.Color;
}

const MySketch: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [textSize, setTextSize] = useState(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [initPoints, setInitPoints] = useState<Point[]>([]);

  let font: p5Types.Font;
  const radius = 70;
  const frameRate = 60;
  const words = [
    "Gashon.",
    "an Engineer.",
    "a Programmer.",
    "a Student.",
    "a Researcher.",
  ];
  const textDensity = 0.35;
  const opacity = 255;
  const overshoot = 0.94;
  const seek = 35;
  const acceleration = 0.45;
  const restoration = 0.62;

  const preload = (p5: p5Types) => {
    if (!p5) return;
    font = p5.loadFont("Metropolis-Light.otf");
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    let canvas = p5
      .createCanvas(p5.windowWidth, p5.windowHeight)
      .parent(canvasParentRef);
    p5.frameRate(frameRate);

    let calculatedTextSize = Math.min(p5.width / 4, p5.height / 4);
    setTextSize(calculatedTextSize);

    setupText(0, p5);

    setInterval(() => {
      setWordIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        setupText(nextIndex, p5);
        return nextIndex;
      });
    }, 5000);
  };

  const setupText = (wordIndex: number, p5: p5Types) => {
    if (!p5 || !font || !font.font) return;

    let word = words[wordIndex % words.length];

    let newPoints = font
      .textToPoints(
        word,
        p5.width / 10,
        (3.5 * p5.height) / 5,
        (6 * p5.width) / (4 * word.length),
        {
          sampleFactor: textDensity,
          simplifyThreshold: 0,
        },
      )
      .map((point, index) => {
        let spawnX = (2 * p5.windowWidth) / 3;
        let spawnY = point.y;
        // If this is the first word or there are no previous points, use the default spawn position
        if (wordIndex === 0 || index >= initPoints.length) {
          return {
            init_position: p5.createVector(point.x, point.y),
            v: p5.createVector(0, 0),
            spawn_pos: p5.createVector(spawnX, spawnY),
            pos: p5.createVector(spawnX, spawnY),
            color_: p5.color(point.x / 5, point.y / 4, point.x / 2, opacity),
          };
        }
        // Use the position of the corresponding point from the previous word
        let previousPoint = initPoints[index];
        return {
          init_position: p5.createVector(point.x, point.y),
          v: p5.createVector(0, 0),
          spawn_pos: p5.createVector(previousPoint.pos.x, previousPoint.pos.y),
          pos: p5.createVector(previousPoint.pos.x, previousPoint.pos.y),
          color_: p5.color(point.x / 5, point.y / 4, point.x / 2, opacity),
        };
      });

    setPoints(newPoints);
    setInitPoints(newPoints);
  };

  const draw = (p5: p5Types) => {
    p5.background(250, 250);
    p5.noStroke();
    points.forEach((point) => {
      p5.fill(point.color_);
      p5.ellipse(point.pos.x, point.pos.y, 4);
    });

    checkMouse(p5);
  };

  const checkMouse = (p5: p5Types) => {
    if (!p5) return;

    p5.stroke(255, 0, 0);
    let newPoints = points.map((point) => {
      let difference = p5.createVector(
        point.pos.x - p5.mouseX,
        point.pos.y - p5.mouseY,
      );
      let dist = p5.sqrt(p5.sq(difference.x) + p5.sq(difference.y));
      if (dist < radius) {
        accelerate(point, difference.mult(acceleration));
      } else if (
        point.pos.x !== point.init_position.x ||
        point.pos.y !== point.init_position.y
      ) {
        let restorative = point.init_position.copy();

        // Subtract the current position from the copied vector
        restorative.sub(point.pos);
        accelerate(point, restorative.mult(restoration));
      }
      return point;
    });
    setPoints(newPoints);
  };

  const accelerate = (point: Point, d: Vector) => {
    point.v.mult(overshoot).add(d.div(seek));
    point.pos.add(point.v);
  };

  // useEffect(() => {
  //   // Update the points whenever the word index changes
  //   setupText(points[0]?.pos?.constructor as unknown as p5Types); // Passing p5 instance from an existing point
  // }, [wordIndex]);

  return <Sketch preload={preload} setup={setup} draw={draw} />;
};

export default MySketch;
