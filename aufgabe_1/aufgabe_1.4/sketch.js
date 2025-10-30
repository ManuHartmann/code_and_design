let moveSlider;   // moves grid left ↔ right
let squareSlider; // makes squares bigger/smaller
let shapeSlider;  // controls circle deformation (oval shape)

let spinDirLeft = 1;
let spinDirRight = -1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Slider 1 – move grid
  moveSlider = createSlider(-1000, 1000, 0);
  moveSlider.position(20, 20);

  // Slider 2 – control square size
squareSlider = createSlider(20, 1000, 200);
  squareSlider.position(20, 50);

  // Slider 3 – deform circles (oval)
  shapeSlider = createSlider(0, 200, 100); // 100 = perfect circle, <100 = flach, >100 = hoch
  shapeSlider.position(20, 80);


  rectMode(CENTER);
  ellipseMode(CENTER);

  leftColor = color(225, 39, 39);
  rightColor = color(225, 39, 39);
}

function draw() {
  background(15,15,15,15);

  // --- Slider value ---
  let moveValue = moveSlider.value();
    let squareValue = squareSlider.value();
  let shapeValue = shapeSlider.value();

  // --- Grid setup ---
  let cx = width * 0.5 + moveValue;
  let cy = height * 0.5;
let spacing = map(squareValue, 20, 1000, 
                  min(width, height) * 0.50,  // small squares → wide grid
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
  rotate(angle * spinDirLeft);
  fill(leftColor);
  rect(0, 0, squareValue, squareValue);
  pop();

  // RIGHT (Tyler)
  push();
  translate(rightX, cy);
  rotate(angle * spinDirRight);
  fill(rightColor);
  rect(0, 0, squareValue, squareValue);
  pop();



// --- 3×3 white dots (now ovals) ---
  fill(255);
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      let x = cx + c * spacing;
      let y = cy + r * spacing;

       // Distance from mouse to the dot
    let d = dist(mouseX, mouseY, x, y);

    // Hover effect when mouse is close
    if (d < pulsingDotD / 1.5) {
      fill(225, 39, 39);; 
      strokeWeight(2);
      ellipse(x, y, pulsingDotD * 0.5, pulsingDotD * 0.5); // larger
    } else {
      fill(255);
    
    }
  

      // shapeValue verändert Verhältnis zwischen Breite und Höhe
      let w = pulsingDotD * (shapeValue / 100);
      let h = pulsingDotD * (200 - shapeValue) / 100;

      ellipse(x, y, w, h);
    }
  }

}

function mousePressed() {
  let margin = 200;
  let cy = height * 0.5;
  let leftX = margin;
  let rightX = width - margin;
  let squareValue = squareSlider.value();

  // Check if mouse clicked inside left square
  if (dist(mouseX, mouseY, leftX, cy) < squareValue / 2) {
    spinDirLeft *= -1; // reverse rotation
  }

  // Check if mouse clicked inside right square
  if (dist(mouseX, mouseY, rightX, cy) < squareValue / 2) {
    spinDirRight *= -1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
