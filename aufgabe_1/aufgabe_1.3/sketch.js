let squareSlider; // makes squares bigger/smaller

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Slider 2 – control square size
  squareSlider = createSlider(20, 1000, 500);
  squareSlider.position(windowWidth / 2, windowHeight - 80); // below it
  squareSlider.addClass('bottomSlider');


  rectMode(CENTER);
  ellipseMode(CENTER);
}

function draw() {
  // leichter Hintergrund → dezente Motion-Trails/Glow
  background(15,15,15,15);

  // --- Slider value ---
  let squareValue = squareSlider.value();

  // --- Grid setup ---
  let cx = width * 0.5;
  let cy = height * 0.5;

  // Abstand der Punkte: kleine Quadrate → weites Raster, grosse → kollabiert ins Zentrum
  let spacing = map(squareValue,20, 1000,min(width, height) * 0.50,0);

  // Basis-Durchmesser der Punkte (Skalierung abhängig vom Viewport)
  let baseDotD = min(width, height) * 0.15;

  // Pulsstärke (0..1) steigt mit Quadratgrösse → mehr „Energie“
  let pulseStrength = map(squareValue, 1000, 20, 0, 1, true);

  // Wie stark die Punkte maximal wachsen dürfen (Amplitude)
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

// LEFT – im Uhrzeigersinn
  push();
  translate(leftX, cy);
  rotate(angle);
  fill(225, 39, 39);
  rect(0, 0, squareValue, squareValue);
  pop();

  // RIGHT – gegen den Uhrzeigersinn
  push();
  translate(rightX, cy);
  rotate(-angle);
  fill(225, 39, 39);
  rect(0, 0, squareValue, squareValue);
  pop();

  // 3×3 Punkte (pulsierend)
  fill(255);
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      let x = cx + c * spacing;
      let y = cy + r * spacing;
      ellipse(x, y, pulsingDotD, pulsingDotD);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
