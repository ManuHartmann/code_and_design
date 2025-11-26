// Audio-reaktive Concert-Waves mit Hover-Rotation & Mic-Icon

let t = 0;                 // "Zeit" für Animation
let mic;                   // Mikrofon-Eingang
let levelSmooth = 0;       // geglätteter Audio-Level
let micEnabled = false;    // ob Mic aktiv ist
let micIconSize = 40;      // Grösse des Mic-Icons

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeCap(ROUND);
  textAlign(CENTER, CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Prüft, ob Maus über dem Mic-Icon ist
function isOverMicIcon() {
  let x1 = width - micIconSize - 20;
  let y1 = height - micIconSize - 20;
  let x2 = width - 20;
  let y2 = height - 20;
  return mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2;
}

// Mausklick: Mic toggeln
function mousePressed() {
  if (isOverMicIcon()) {
    if (!micEnabled) {
      // Audio muss vom User gestartet werden (Browser-Policy)
      userStartAudio().then(() => {
        if (!mic) {
          mic = new p5.AudioIn();
        }
        mic.start();
        micEnabled = true;
      });
    } else {
      // Mic ausschalten
      if (mic) mic.stop();
      micEnabled = false;
    }
  }
}

function draw() {
  // --- Hintergrund: dunkles Rot ---
  background(10, 0, 0); // fast schwarz mit Rotstich

  // --- Noise-Layer (subtiles Flimmern) ---
  drawNoiseLayer();

  // --- Audio-Level auslesen & glätten ---
  updateAudioLevel();

  // --- Wave-Parameter ---
  let freq = 0.02;   // horizontale Frequenz (Abstand der Wellenberge)
  let speed = 0.02;  // Animations-Geschwindigkeit
  t += speed;

  // Basis-Amplitude, reagiert auf Audio-Level
  // leise = 20px, laut = bis ~1/4 der Höhe
  let baseAmp = map(levelSmooth, 0, 0.3, 20, height * 0.25, true);

  // vertikale Positionen der drei Waves
  let y1 = height * 0.35;
  let y2 = height * 0.50;
  let y3 = height * 0.65;

  // --- Wellen zeichnen (mit Glow & Hover-Rotation) ---
  push();
  blendMode(SCREEN); // weisse Linien leuchten auf dunklem Rot

  drawGlowWave(y1, baseAmp * 0.4, freq);
  drawGlowWave(y2, baseAmp * 0.7, freq);
  drawGlowWave(y3, baseAmp * 1.0, freq);

  pop();

  // --- Mic Icon UI ---
  drawMicIcon();
}

// Zeichnet einen Noise-Layer über den Hintergrund
function drawNoiseLayer() {
  push();
  strokeWeight(1);
  for (let i = 0; i < 600; i++) {
    let x = random(width);
    let y = random(height);
    // leicht variierende dunkle Rottöne, sehr transparent
    stroke(80 + random(-30, 30), 0, 0, 25);
    point(x, y);
  }
  pop();
}

// Holt den Mic-Level und glättet ihn
function updateAudioLevel() {
  if (micEnabled && mic) {
    let level = mic.getLevel();
    // Lerp = smooth nachziehen → weniger Flackern
    levelSmooth = lerp(levelSmooth, level, 0.1);
  } else {
    // langsam wieder gegen 0 laufen, wenn Mic aus ist
    levelSmooth = lerp(levelSmooth, 0, 0.1);
  }
}

// Zeichnet eine Welle mit mehreren Glow-Layern
function drawGlowWave(centerY, amp, freq) {
  let glowLayers = 4; // Anzahl Glow-Layers

  // Hover-Logik: wenn Maus in der Nähe der Wave ist
  let hoverRange = 40;
  let isHover = abs(mouseY - centerY) < hoverRange;
  let maxRotation = 0.18; // ca. 10° in Radiant
  let rotationAmount = 0;

  if (isHover) {
    // Rotation abhängig von Mausposition links/rechts
    rotationAmount = map(mouseX, 0, width, -maxRotation, maxRotation);
  }

  // Koordinatensystem vorbereiten (für Rotation)
  push();
  translate(width / 2, centerY);
  rotate(rotationAmount);

  for (let g = glowLayers - 1; g >= 0; g--) {
    // dick -> dünn
    let w = map(g, 0, glowLayers - 1, 10, 2);
    // transparent -> deckender
    let alpha = map(g, 0, glowLayers - 1, 40, 200);

    stroke(255, 255, 255, alpha); // weisser Glow
    strokeWeight(w);

    beginShape();
    // wir zeichnen relativ um die Mitte (−width/2 .. +width/2)
    for (let x = -width / 2; x <= width / 2; x += 8) {
      let angle = x * freq + t;
      let y = sin(angle) * amp;
      curveVertex(x, y);
    }
    endShape();
  }

  pop();
}

// Zeichnet ein simples Mic-Icon unten rechts
function drawMicIcon() {
  let x = width - micIconSize / 2 - 20;
  let y = height - micIconSize / 2 - 20;

  push();
  rectMode(CENTER);
  noStroke();

  // Hintergrund des Icons
  if (isOverMicIcon()) {
    fill(255, 255, 255, 40); // leicht heller beim Hover
    rect(x, y, micIconSize + 10, micIconSize + 10, 12);
  }

  // Kreis-Hintergrund
  fill(micEnabled ? color(0, 200, 120) : color(80)); // grün = an, grau = aus
  ellipse(x, y, micIconSize, micIconSize);

  // Mic Symbol
  stroke(0);
  strokeWeight(2);
  // Mic-Kapsel
  line(x, y - 8, x, y + 4);
  ellipse(x, y - 8, 10, 14);
  // Fuss
  line(x - 6, y + 6, x + 6, y + 6);
  line(x, y + 4, x, y + 10);

  pop();
}
