/**
 * HandPose Boilerplate mit ml5.js
 * 
 * Dieses Sketch erkennt Hände über die Webcam und zeichnet die erkannten Keypoints.
 * Es dient als Ausgangspunkt für eigene Hand-Tracking-Projekte.
 * 
 * Dokumentation: https://docs.ml5js.org/#/reference/handpose
 * 
 * Jede Hand hat 21 Keypoints (0-20):
 * - 0: Handgelenk
 * - 1-4: Daumen
 * - 5-8: Zeigefinger
 * - 9-12: Mittelfinger
 * - 13-16: Ringfinger
 * - 17-20: Kleiner Finger
 */

// Globale Variablen
let handpose;           // Das ml5.js HandPose-Modell
let video;              // Die Webcam
let hands = [];         // Array mit allen erkannten Händen
let ratio;              // Skalierungsfaktor zwischen Video und Canvas
let isModelReady = false; // Flag, ob das Modell geladen und Hände erkannt wurden
let selectedShape = 'circle'; // Aktuell ausgewählte Form: 'circle' | 'star' | 'triangle' | 'square'

// Per-Hand Zustand (Farbe, Alpha, letzter Touch)
let handStates = []; // Index entspricht der Reihenfolge von `hands` im Callback

/**
 * Lädt das HandPose-Modell vor dem Setup
 * Diese Funktion wird automatisch vor setup() ausgeführt
 */
function preload() {
  handpose = ml5.handPose();
}

/**
 * Initialisiert Canvas und Webcam
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Performanceoptimierung
  
  // Webcam einrichten
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Versteckt das Standard-Video-Element
  
  // Berechne Skalierungsfaktor für Video-zu-Canvas-Anpassung
  ratio = width / video.width;
  
  // Starte Hand-Erkennung
  handpose.detectStart(video, gotHands);

  // --- FORM-AUSWAHL BUTTONS ---
  let info = createP('wähle deine Form:');
  info.class('shape-label'); // nutzt CSS-Klasse
  // mache den Text schwarz und fett
  info.style('color', '#000000');
  info.style('font-weight', '700');

  // Buttons erstellen (mit Icons)
  let b1 = createButton('●');
  let b2 = createButton('★');
  let b3 = createButton('▲');
  let b4 = createButton('■');

  // CSS-Klasse anwenden
  [b1, b2, b3, b4].forEach(btn => btn.class('shape-btn'));

  // Click Events
  b1.mousePressed(() => setShape('circle', b1));
  b2.mousePressed(() => setShape('star', b2));
  b3.mousePressed(() => setShape('triangle', b3));
  b4.mousePressed(() => setShape('square', b4));

  // UI Positionen
  let uiX = 12;
  let uiY = 8;
  info.position(uiX, uiY);
  b1.position(uiX, uiY + 30);
  b2.position(uiX + 70, uiY + 28);
  b3.position(uiX + 140, uiY + 28);
  b4.position(uiX + 210, uiY + 28);

  // Funktion: active highlight wechseln
  function setShape(shape, btn) {
    selectedShape = shape;
    [b1, b2, b3, b4].forEach(b => b.removeClass('active'));
    btn.addClass('active');
  }
}

/**
 * Hauptzeichnungs-Loop
 */
function draw() {
  background(0);

  // Spiegle die Darstellung horizontal (für intuitivere Interaktion)
  push();
  translate(width, 0);
  scale(-1, 1);

  //Zeige das Video (optional)
  image(video, 0, 0, video.width * ratio, video.height * ratio);
  
  // Zeichne nur, wenn das Modell bereit ist und Hände erkannt wurden
  if (isModelReady) {
    drawHandPoints();
    
    // HIER KÖNNEN EIGENE/Andere ZEICHNUNGEN Oder Interaktionen HINZUGEFÜGT WERDEN
    
  }
  
  pop();
}

/**
 * Callback-Funktion für HandPose-Ergebnisse
 * Wird automatisch aufgerufen, wenn neue Hand-Daten verfügbar sind
 * 
 * @param {Array} results - Array mit erkannten Händen
 */
function gotHands(results) {
  hands = results;
  
  // Setze Flag, sobald erste Hand erkannt wurde
  if (hands.length > 0) {
    isModelReady = true;
  }

  // Wenn Hände weniger werden, kürze handStates, damit Indizes nicht verschoben werden
  if (handStates.length > hands.length) {
    handStates.length = hands.length;
  }
}

/**
 * Zeichnet alle erkannten Hand-Keypoints
 * Jede Hand hat 21 Keypoints (siehe Kommentar oben)
 */
function drawHandPoints() {
  // Durchlaufe alle erkannten Hände (normalerweise max. 2)
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    // Durchlaufe alle 21 Keypoints einer Hand
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      
      // Zeichne Keypoint als grüner Kreis
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x * ratio, keypoint.y * ratio, 10);
    }

    // Zeige explizit Daumen- und Zeigfinger-Tipps
    // ml5 HandPose Indizes: Daumen-Tip = 4, Zeigfinger-Tip = 8
    let thumbTip = hand.keypoints[4];
    let indexTip = hand.keypoints[8];

    if (thumbTip) {
      push();
      fill(255, 0, 0); // Rot für Daumen
      noStroke();
      circle(thumbTip.x * ratio, thumbTip.y * ratio, 16);
      fill(255);
      textSize(14);
      textAlign(LEFT, CENTER);
      let tx = Math.round(thumbTip.x);
      let ty = Math.round(thumbTip.y);
      pop();
    }

   // --- KREIS UM DEN DAUMEN-TIP (Keypoint 4) ---
if (thumbTip) {
  let tx = thumbTip.x * ratio;
  let ty = thumbTip.y * ratio;

  // Kreis-Radius pulsiert leicht über die Zeit
  let r = 40 + sin(frameCount * 0.1) * 5;

  push();
  noFill();
  stroke(255, 0, 0, 150);
  strokeWeight(3);
  circle(tx, ty, r);
  pop();
}

    if (indexTip) {
      push();
      fill(0, 100, 255); // Blau für Zeigfinger
      noStroke();
      circle(indexTip.x * ratio, indexTip.y * ratio, 16);
      fill(255);
      textSize(14);
      textAlign(LEFT, CENTER);
      let ix = Math.round(indexTip.x);
      let iy = Math.round(indexTip.y);
      pop();
    }

    // --- KREIS UM DEN ZEIGEFINGER-TIP (Keypoint 8) ---
if (indexTip) {
  let ix = indexTip.x * ratio;
  let iy = indexTip.y * ratio;

  // Pulsierender Radius (z.B. leicht anders, damit man sie unterscheiden kann)
  let r2 = 40 + sin(frameCount * 0.12) * 5;

  push();
  noFill();
  stroke(0, 120, 255, 150); // Blau
  strokeWeight(3);
  circle(ix, iy, r2);
  pop();
}

    // --- KREIS ZWISCHEN DAUMEN- UND ZEIGFINGER (MIDPOINT) ---
if (thumbTip && indexTip) {
  // Mitte in Video-Koordinaten berechnen
  let mx = (thumbTip.x + indexTip.x) / 2;
  let my = (thumbTip.y + indexTip.y) / 2;

  // Skaliert auf Canvas
  let mxs = mx * ratio;
  let mys = my * ratio;

  // Abstand der beiden Tipps (Video-Pixel)
  let d = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);

  // Radius basierend auf Abstand, minimale Größe 20
  let radius = max(20, d * ratio * 0.6);

  // Touch-Detection: Abstand auf Canvas verwenden
  let touchDist = d * ratio;
  let touching = touchDist < 50; // engerer Schwellwert für "fast berühren"

  // Initialisiere Zustand für diese Hand, falls noch nicht vorhanden
  if (!handStates[i]) {
    handStates[i] = {
      color: [255, 200, 0],
      alpha: 140,
      lastTouch: false,
      touchStart: null,         // millis() Zeitpunkt wann Touch begann
      activationCooldown: false, // verhindert mehrfaches Toggeln während eines Touch
      enabled: false,           // ob das Objekt für diese Hand aktiv ist
      // smoothing state
      smoothX: null,
      smoothY: null,
      smoothAngle: null
    };
  }
  let state = handStates[i];

  // --- TOUCH / ACTIVATION LOGIK (wiederhergestellt) ---
  // Wenn gerade berührt (touching == true)
  if (touching) {
    // Starte Timer beim ersten Frame des Touch
    if (state.touchStart === null) {
      state.touchStart = millis();
    }
    let held = millis() - state.touchStart;

    // Wenn länger als 3s gehalten und noch nicht während dieses Touch getoggelt
    if (held >= 3000 && !state.activationCooldown) {
      state.enabled = !state.enabled; // Toggle ON/OFF
      state.activationCooldown = true; // blockiere weiteres Toggeln bis Finger weg sind
      // setze eine visuelle Rückmeldung: neue Farbe beim Aktiveren/Deaktivieren
      state.color = [Math.round(random(60, 255)), Math.round(random(60, 255)), Math.round(random(60, 255))];
      state.alpha = state.enabled ? 200 : 100;
    }

    // Bei erstem Kontakt (kurzer Tap) kleine Farbänderung
    if (!state.lastTouch && held < 3000) {
      state.color = [
        Math.round(random(80, 255)),
        Math.round(random(80, 255)),
        Math.round(random(80, 255))
      ];
      state.alpha = 200;
    }
  } else {
    // Wenn nicht berührt: Timer und Cooldown zurücksetzen
    state.touchStart = null;
    state.activationCooldown = false;
    // langsames Alpha-Reset
    state.alpha = lerp(state.alpha || 140, 140, 0.15);
  }
  // setze lastTouch für das nächste Frame
  state.lastTouch = touching;

  // Berechne Winkel zwischen Daumen und Zeigfinger in Canvas-Koordinaten
  let txCanvas = thumbTip.x * ratio;
  let tyCanvas = thumbTip.y * ratio;
  let ixCanvas = indexTip.x * ratio;
  let iyCanvas = indexTip.y * ratio;
  let angle = atan2(iyCanvas - tyCanvas, ixCanvas - txCanvas);

  // Smoothing: initialisiere bei erstem Frame
  if (state.smoothX === null) {
    state.smoothX = mxs;
    state.smoothY = mys;
    state.smoothAngle = angle;
  }
  // Sanfte Interpolation zur Reduktion von Jitter
  state.smoothX = lerp(state.smoothX, mxs, 0.25);
  state.smoothY = lerp(state.smoothY, mys, 0.25);
  // Winkel-Lerp: achte auf Wrap-around (kurzeste Richtung)
  // einfache Lerp funktioniert meist, für starke Sprünge könnte man normalize verwenden
  state.smoothAngle = lerp(state.smoothAngle, angle, 0.25);

  push();
  // Verschiebe zum geglätteten Mittelpunkt und rotiere um den geglätteten Winkel
  translate(state.smoothX, state.smoothY);
  rotate(state.smoothAngle);

  // Visual Hold-Progress: wenn Touch läuft, zeige einen arc, der sich füllt (unter dem Objekt)
  if (touching && state.touchStart !== null) {
    let held = millis() - state.touchStart;
    let progress = constrain(held / 3000, 0, 1);
    noFill();
    stroke(255, 255, 255, 140);
    strokeWeight(4);
    // kleiner Abstand zum Objekt
    let arcR = radius + 12;
    // Zeichne von -PI/2 (oben) im Uhrzeigersinn
    arc(0, 0, arcR, arcR, -PI/2, -PI/2 + TWO_PI * progress);
  }

  // Wenn die Funktion für diese Hand aktiviert ist -> zeichne volles Symbol
  if (state.enabled) {
    if (selectedShape === 'circle') {
      // Voll deckende Füllfarbe
      fill(state.color[0], state.color[1], state.color[2], 255);
      noStroke();
      circle(0, 0, radius);
      noFill();
      stroke(state.color[0], Math.max(0, state.color[1]-20), Math.max(0, state.color[2]-40), 255);
      strokeWeight(3);
      circle(0, 0, radius + 6);
    } else if (selectedShape === 'star') {
      noStroke();
      // Voll deckende Füllfarbe
      fill(state.color[0], state.color[1], state.color[2], 255);
      drawStar(0, 0, radius * 0.35, radius * 0.85, 5);
      stroke(state.color[0], Math.max(0, state.color[1]-20), Math.max(0, state.color[2]-40), 255);
      strokeWeight(3);
      noFill();
      drawStar(0, 0, radius * 0.35, radius * 0.85, 5);
    } else if (selectedShape === 'triangle') {
      noStroke();
      // Voll deckende Füllfarbe
      fill(state.color[0], state.color[1], state.color[2], 255);
      let h = radius;
      triangle(-h * 0.6, h * 0.7, h * 0.6, h * 0.7, 0, -h * 0.6);
      stroke(Math.max(0, state.color[0]-80), Math.max(0, state.color[1]-40), Math.max(0, state.color[2]-20), 255);
      strokeWeight(3);
      noFill();
      triangle(-h * 0.6, h * 0.7, h * 0.6, h * 0.7, 0, -h * 0.6);
    } else if (selectedShape === 'square') {
      noStroke();
      // Voll deckende Füllfarbe
      fill(state.color[0], state.color[1], state.color[2], 255);
      rectMode(CENTER);
      rect(0, 0, radius * 1.2, radius * 1.2, 8);
      stroke(Math.max(0, state.color[0]-80), Math.max(0, state.color[1]-40), Math.max(0, state.color[2]-20), 255);
      strokeWeight(3);
      noFill();
      rect(0, 0, radius * 1.2 + 6, radius * 1.2 + 6, 8);
    }
    } else {
      // Platzhalter wenn deaktiviert: 0% Deckkraft (unsichtbar)
      noFill();
      stroke(180, 180, 180, 0);
      strokeWeight(2);
      if (selectedShape === 'circle') {
        circle(0, 0, radius);
      } else if (selectedShape === 'star') {
        drawStar(0, 0, radius * 0.35, radius * 0.85, 5);
      } else if (selectedShape === 'triangle') {
        let h = radius;
        triangle(-h * 0.6, h * 0.7, h * 0.6, h * 0.7, 0, -h * 0.6);
      } else if (selectedShape === 'square') {
        rectMode(CENTER);
        rect(0, 0, radius * 1.2, radius * 1.2, 8);
      }
    }
    pop();
      pop();
    }           // schliesst: if (thumbTip && indexTip)
  }             // schliesst: for (let i = 0; i < hands.length; i++)
}               // schliesst: function drawHandPoints()

// Hilfsfunktion: Stern zeichnen (wiederhergestellt)
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let half = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + half) * radius1;
    sy = y + sin(a + half) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}