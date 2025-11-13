// t = "Zeit" für die Sinus-Wellen (damit sie sich bewegen)
let t = 0;

// Mikrofon-Input
let mic;

// geglätteter Audio-Level (damit es nicht nervös zittert)
let levelSmooth = 10;

// wurde schon geklickt und Audio gestartet?
let started = false;

// merkt sich: ist aktuell irgendeine Linie gehovt?
let hoverAny = false;

// nur noch aus älterer Version, aktuell nicht benutzt
let micEnabled = false;
let micIconSize = 40;


// Wird einmal am Anfang ausgeführt
function setup() {
  // Canvas so gross wie das Browserfenster
  createCanvas(windowWidth, windowHeight);

  // Linien dicke
  strokeWeight(3);

  // keine Flächen füllen, nur Linien zeichnen
  noFill();

  // Text zentriert ausrichten (wichtig für Start-Meldung)
  textAlign(CENTER, CENTER);
}

// Wenn das Browserfenster die Grösse ändert
function windowResized() {
  // Canvas an neue Fenstergrösse anpassen
  resizeCanvas(windowWidth, windowHeight);
}

// Wird bei jedem Mausklick auf die Seite ausgeführt
function mousePressed() {
  // Nur beim allerersten Klick Audio starten
  if (!started) {
    // userStartAudio() ist nötig, damit der Browser Audio erlaubt
    userStartAudio().then(() => {
      // Mikrofon erstellen und starten
      mic = new p5.AudioIn();
      mic.start();
      started = true;
    });
  }
}

function draw() {
  // leichter Trail-Hintergrund
  // Der 4. Wert (60) ist die Transparenz -> je kleiner, desto mehr "Spuren"
  background(20, 20, 20, 40);

  // --- STARTZUSTAND, BEVOR AUDIO AKTIV IST ---
  if (!started) {
    // Text leicht auf- und abwippen lassen
    let y = height / 2 + sin(frameCount * 0.05) * 4; // tiny vertical float

    // animierte Punkte "..." hinter dem Text
    let dots = ".".repeat(int((frameCount / 30) % 4));

    noStroke();
    textSize(24);
    text("Click to enable microphone" + dots, width / 2, y);

    // draw() hier abbrechen, solange das Mic noch nicht aktiviert ist
    return;
  }

  // --- AUDIO EINLESEN & GLÄTTEN ---

  // aktueller Lautstärke-Wert vom Mikrofon (sehr kleine Zahl, etwa 0–0.3)
  let level = mic.getLevel();

  // levelSmooth nähert sich level an (0.25 = wie "träge" das passiert)
  levelSmooth = lerp(levelSmooth, level, 0.25);

  // wie stark die Wellen auf Audio reagieren sollen
  let reactivity = 200;

  // Verstärker-Faktor für die Amplitude der Wellen
  // ampBoost ist ungefähr 1, wird aber mit Lautstärke grösser
  let ampBoost = 1 + levelSmooth * reactivity;

  // --- ZEIT & HORIZONTALER SPEED ---

  // Grund-weiterlaufen der Zeit: ohne Maus würden sie so schon "tanzen"
  t += 0.05;

  // zu Beginn jedes Frames: niemand wird gehovt
  hoverAny = false;

  // maximale Geschwindigkeit, wie schnell die Wellen sich horizontal verschieben
  let maxSpeed = 0.5;

  // Mausposition in Geschwindigkeits-Wert umrechnen:
  let speed = map(mouseX, 0, width, maxSpeed, -maxSpeed);


  // kleine "Dead Zone" in der Mitte: dort bleibt die Bewegung stehen
  if (abs(speed) < maxSpeed * 0.1) {
    speed = 0;
  }

  // Zeit zusätzlich mit der Maus steuern
  t += speed;

  // --- WAVE-GRUPPEN ZEICHNEN ---
  // Jede Gruppe ist ein "Stapel" von Linien mit ähnlicher Farbe/Bewegung

  // rote, starke Hauptwellen
  drawWaveGroup(
    color(255, 0, 0),      // Rot
    height * 0.50,         // vertikale Basis-Position
    0.15,                   // Grund-Frequenz (wie oft sie schwingen)
 60 * ampBoost,        // Grund-Amplitude * Audio-Verstärkung
    4,                      // Anzahl Linien in der Gruppe
    180,                   // Start-Transparenz
    70                // End-Transparenz
  );

  // schwarze Welle, sehr subtil, mit eigener Alpha-Verteilung
  drawWaveGroup(
    color(0, 0, 0),        // Schwarz
    height * 0.50,
    0.003,
    5 * ampBoost,
    6,
    180,                   // Start-Transparenz
    70                     // End-Transparenz
  );

  // hellblaue Wellen etwas weiter unten
  drawWaveGroup(
    color(173, 200, 230),  // Light Blue
    height * 0.8,
    0.08,
    20 * ampBoost,
    10,
       180,                   // Start-Transparenz
    70                     // End-Transparenz
  );

  // weisse, feinere Wellen oben
  drawWaveGroup(
    color(255, 255, 255),  // Weiss
    height * 0.35,
    0.05,
    10 * ampBoost,
    10
  );

  
}


// -----------------------------------------------------------
// Mehrere Linien einer "Wave-Gruppe" zeichnen
// -----------------------------------------------------------
function drawWaveGroup(
  baseColor,              // Grundfarbe der Gruppe
  baseY,                  // Basis-Höhe der mittleren Linie
  freq,                   // Grund-Frequenz
  amp,                    // Grund-Amplitude
  count,                  // Anzahl Linien
  alphaStart = 200,       // Anfangs-Transparenz (optional)
  alphaEnd = 50           // End-Transparenz (optional)
) {
  for (let i = 0; i < count; i++) {
    // jede Linie leicht über/unter der Basis schieben
    let yOffset = baseY + (i - count / 2) * 10;

    // jede Linie hat eine eigene Phasenverschiebung -> sie sind nicht identisch
    let phase = i * 0.35;

    // Transparenz von oben nach unten interpolieren
    let a = map(i, 0, count - 1, alphaStart, alphaEnd);

    // Frequenz leicht erhöhen pro Linie -> etwas dichter/wirbler
    let fLine = freq * (1 + i * 0.03);

    // Amplitude Richtung Rand etwas kleiner machen -> weniger extrem
    let aLine = amp * (1 - i * 0.06);

    // Farbe mit passender Transparenz setzen
    stroke(red(baseColor), green(baseColor), blue(baseColor), a);

    // einzelne Linie zeichnen
    drawWave(yOffset, fLine, aLine, phase);
  }
}


// -----------------------------------------------------------
// Eine einzelne Linien-Welle zeichnen (mit Hover-Reaktion)
// -----------------------------------------------------------
function drawWave(yOffset, freq, amp, phaseOffset) {
  // --- HOVER-TEST ---
  let hovered = false;

  // Nur testen, wenn Maus im Canvas-Bereich ist
  if (mouseX >= 0 && mouseX <= width) {
    // y-Position der Welle genau unter der Maus berechnen
    let yAtMouse = yOffset + sin(mouseX * freq + t + phaseOffset) * amp;

    // Wie nahe muss die Maus an der Linie sein, um als "Hover" zu zählen?
    let threshold = 14;

    // Wenn der Abstand Maus-y zu Wellen-y klein genug ist -> hovered = true
    hovered = abs(mouseY - yAtMouse) < threshold;
  }

  // --- HOVER: FREQUENZ + AMPLITUDE BOOST ---
  if (hovered) {
    hoverAny = true; // für den Cursor oder andere Effekte

    // Welle bei Hover "energetischer" machen:
    // - höhere Frequenz -> mehr Wellen pro Breite
    // - höhere Amplitude -> die Ausschläge werden grösser
    freq *= 1.6;
    amp *= 1.25;

    // Welle mit den verstärkten Werten zeichnen
    beginShape();
    for (let x = 0; x < width; x += 6) {
      let y = yOffset + sin(x * freq + t + phaseOffset) * amp;
      vertex(x, y);
    }
    endShape();

    // WICHTIG: danach NICHT nochmal "normal" zeichnen
    return;
  }

  // --- NORMALER FALL (ohne Hover) ---
  beginShape();
  for (let x = 0; x < width; x += 6) {
    let y = yOffset + sin(x * freq + t + phaseOffset) * amp;
    vertex(x, y);
  }
  endShape();
}
