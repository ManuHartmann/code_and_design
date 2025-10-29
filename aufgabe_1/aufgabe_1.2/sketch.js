let moveSlider;
let sizeSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Slider 1 → controls left-right movement
  moveSlider = createSlider(-200, 200, 0);
  moveSlider.position(20, 20);

  // Slider 2 → controls circle size (opposite scaling)
  sizeSlider = createSlider(10, 1500, 50); // min, max, start
  sizeSlider.position(20, 50);
}

function draw() {
  background(15, 15, 15);

  // Read sliders
  let moveValue = moveSlider.value();
  let sizeValue = sizeSlider.value();

  // Base X positions for columns
  let baseLeftX  = width * 0.25;
  let baseMidX   = width * 0.50;
  let baseRightX = width * 0.75;

  // Move left/right columns in opposite directions
  let leftX  = baseLeftX + moveValue;
  let rightX = baseRightX - moveValue;

  // Opposite scaling
  let leftSize  = map(sizeValue, 10, 1500, 50, 1000);
  let rightSize = map(sizeValue, 10, 1500, 1000, 50);


  // Keep sizes safe
  let maxD = min(width, height) * 1.3;
  leftSize  = constrain(leftSize, 10, maxD);
  rightSize = constrain(rightSize, 10, maxD);

  // Vertical rows
  let gapY = height / 4;
  let yTop = height / 2 - gapY;
  let yMid = height / 2;
  let yBot = height / 2 + gapY;


  ellipseMode(CENTER);

 // --- LEFT COLUMN (RED) — uses leftSize (grows) ---
  fill(225, 39, 39);
  ellipse(leftX, yTop, leftSize, leftSize);
  ellipse(leftX, yMid, leftSize, leftSize);
  ellipse(leftX, yBot, leftSize, leftSize);

  // --- MIDDLE COLUMN (GREY) — neutral anchor (static or mild) ---
  fill(122, 112, 112);
  let midSize = min(width, height) * 0.22; // simple static anchor
  ellipse(width / 2, yTop, midSize, midSize);
  ellipse(width / 2, yMid, midSize, midSize);
  ellipse(width / 2, yBot, midSize, midSize);

  // --- RIGHT COLUMN (WHITE) — uses rightSize (shrinks) ---
  fill(234, 234, 234);
  ellipse(rightX, yTop, rightSize, rightSize);
  ellipse(rightX, yMid, rightSize, rightSize);
  ellipse(rightX, yBot, rightSize, rightSize);
}
