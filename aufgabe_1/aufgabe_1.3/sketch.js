let moveSlider;   // moves grid left ↔ right
let squareSlider; // makes squares bigger/smaller

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Slider 1 – move grid
  moveSlider = createSlider(-200, 200, 0);
  moveSlider.position(20, 20);

  // Slider 2 – control square size
squareSlider = createSlider(20, 1000, 200);
  squareSlider.position(20, 50);


  rectMode(CENTER);
  ellipseMode(CENTER);
}

function draw() {
  background(15,15,15,15);

  // --- Slider value ---
  let moveValue = moveSlider.value();
    let squareValue = squareSlider.value();

  // --- Grid setup ---
  let cx = width * 0.5 + moveValue;
  let cy = height * 0.5;
let spacing = map(squareValue, 20, 1000, 
                  min(width, height) * 0.30,  // small squares → wide grid
                  0);   
                 // big squares → all overlap in center


// base size for dots
let baseDotD = min(width, height) * 0.15;

// pulse strength comes from the square size (0..1)
let pulseStrength = map(squareValue, 1000, 20, 0, 1, true);

// how much bigger they get at max
let growMax = baseDotD * 0.7 * pulseStrength;

// sawtooth beat: grows from base → base+growMax, then snaps back
let period = 60;                              // frames per cycle (~1s at 60fps)
let t = (frameCount % period) / period;       // 0..1 ramp per cycle
let pulsingDotD = baseDotD + t * growMax;     // animated diameter


  // --- Speakers ---
 let margin = 200;
  let leftX = margin;
  let rightX = width - margin;

// --- Rotation speed depends on square size ---
let spinSpeed = map(squareValue, 20, width * 2, 0.002, 0.07); // min → max speed
let angle = frameCount * spinSpeed; // endless spin, faster when bigger

// LEFT (Josh)
push();
translate(leftX, cy);
rotate(angle); // rotate clockwise
fill(225, 39, 39);
rect(0, 0, squareValue, squareValue);
pop();

// RIGHT (Tyler)
push();
translate(rightX, cy);
rotate(-angle); // opposite direction
fill(225, 39, 39);
rect(0, 0, squareValue, squareValue);
pop();



  // 3×3 white dots
  fill(255);
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      let x = cx + c * spacing;
      let y = cy + r * spacing;
      ellipse(x, y, pulsingDotD, pulsingDotD);

    }
  }

  // Label
  fill(220);
  textSize(14);
  text('Move', moveSlider.x * 2 + moveSlider.width, 35);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
