// Audio-reaktive Waves mit Hover-Rotation
// Palette: Light Blue, White, Red, Dark Gray
let t = 0;
let mic;
let levelSmooth = 0;
let started = false;
let hoverAny = false;
let micEnabled = false;
let micIconSize = 40;


function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(4);
  noFill();
  textAlign(CENTER, CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
  // leichter Trail-Hintergrund
  background(20, 20, 20, 60); // lighter fade trail

if (!started) {
  let y = height / 2 + sin(frameCount * 0.05) * 4; // tiny vertical float
  let dots = ".".repeat(int((frameCount / 30) % 4)); 
  noStroke();
  textSize(24);
  text("Click to enable microphone" + dots, width / 2, y);
  return;
}


  // --- Audio: Lautstärke glätten & in Amplitude übersetzen ---
  let level = mic.getLevel();
  levelSmooth = lerp(levelSmooth, level, 0.25);
  let reactivity = 50;                
  let ampBoost = 1 + levelSmooth * reactivity;

  // Zeit
  t += 0.05;

  hoverAny = false;

  // --- WAVE-GRUPPEN ---

  drawWaveGroup(color(255,   0,   0), height * 0.50, 0.4, 400 * ampBoost, 6);
  drawWaveGroup(color(  0,   0,   0), height * 0.50, 0.01, 20 * ampBoost, 6, 180, 70);
    drawWaveGroup(color(173, 200, 230), height * 0.65, 0.10, 50 * ampBoost, 10);
  drawWaveGroup(color(255, 255, 255), height * 0.40, 0.05, 10 * ampBoost, 10);

  // Optional: Cursor-Feedback
  // cursor(hoverAny ? HAND : ARROW);
}

// Mehrere Linien
function drawWaveGroup(baseColor, baseY, freq, amp, count, alphaStart = 200, alphaEnd = 50) {
  for (let i = 0; i < count; i++) {
    let yOffset = baseY + (i - count / 2) * 10;
    let phase   = i * 0.35;
    let a       = map(i, 0, count - 1, alphaStart, alphaEnd);

    let fLine = freq * (1 + i * 0.03);
    let aLine = amp  * (1 - i * 0.06);

    stroke(red(baseColor), green(baseColor), blue(baseColor), a);
    drawWave(yOffset, fLine, aLine, phase);
  }
}

// Eine einzelne Linie
function drawWave(yOffset, freq, amp, phaseOffset) {
  // Hover-Test
  let hovered = false;
  if (mouseX >= 0 && mouseX <= width) {
    let yAtMouse = yOffset + sin(mouseX * freq + t + phaseOffset) * amp;
    let threshold = 14;
    hovered = abs(mouseY - yAtMouse) < threshold;
  }

  // --- HOVER: FREQUENCY + HEIGHT BOOST ---
  if (hovered) {
    hoverAny = true;

    // BOOST the wave design on hover
    freq *= 1.6;   // tighter wave on hover
    amp  *= 1.25;  // taller wave on hover

    beginShape();
    for (let x = 0; x < width; x += 6) {
      let y = yOffset + sin(x * freq + t + phaseOffset) * amp;
      vertex(x, y);
    }
    endShape();
    return; // wichtig: damit nicht noch einmal "normal" gezeichnet wird
  }

  // Normal render
  beginShape();
  for (let x = 0; x < width; x += 6) {
    let y = yOffset + sin(x * freq + t + phaseOffset) * amp;
    vertex(x, y);
  }
  endShape();
}
