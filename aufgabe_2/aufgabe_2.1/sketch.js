// React-to-audio waves (talk and they go crazy!)
let t = 0;
let mic;            // microphone input
let levelSmooth = 0; // smoothed loudness
let started = false;
// --- add near the top ---
let hoverAny = false;    // for cursor feedback


function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  noFill();

  // mic must start from a user gesture; click to start
  textAlign(CENTER, CENTER);
}

function mousePressed() {
  if (!started) {
    userStartAudio().then(() => {
      mic = new p5.AudioIn();
      mic.start();
      started = true;
    });
  }
}

function draw() {
  background(10,10,10,10);

  // Show hint until mic is started
  if (!started) {
    fill(200);
    noStroke();
    text("Click to enable microphone", width/2, height/2);
    return;
  }

  // Read mic level (0..~1). Smooth it so it’s not jittery.
  let level = mic.getLevel();                 // raw loudness
  levelSmooth = lerp(levelSmooth, level, 0.15); // smooth

  // Map loudness to an amplitude boost (talk louder -> bigger waves)
  // tweak 'reactivity' for how crazy it should get when you talk
  let reactivity = 90; // try 40..150
  let ampBoost = 1 + levelSmooth * reactivity;

  // Base params
  let speed = 0.02;
  t += speed;

  // Three color groups; each gets amplitude multiplied by ampBoost
  drawWaveGroup(color(0, 0, 255), height * 0.7, 0.018, 60 * ampBoost, 6); // blue
  drawWaveGroup(color(0, 255, 0), height * 0.5, 0.025, 50 * ampBoost, 6); // green
  drawWaveGroup(color(255, 0, 0), height * 0.3, 0.014, 80 * ampBoost, 6); // red
    drawWave(height * 0.30, 0.020, 90, 0);
}

function drawWaveGroup(baseColor, baseY, freq, amp, count) {
  for (let i = 0; i < count; i++) {
    // subtle offsets per line for a layered look
    let yOffset = baseY + (i - count / 2) * 4;
    let phase = i * 0.35;
    let a = map(i, 0, count - 1, 200, 50); // fade
    stroke(red(baseColor), green(baseColor), blue(baseColor), a);

    // slight per-line variation
    let f = freq * (1 + i * 0.03);
    let aLine = amp * (1 - i * 0.06);

    drawWave(yOffset, f, aLine, phase);
  }
}

function drawWave(yOffset, freq, amp, phaseOffset) {
  beginShape();
  for (let x = 0; x < width; x += 6) {
    let y = yOffset + sin(x * freq + t + phaseOffset) * amp;
    vertex(x, y);
  }
  endShape();
}
