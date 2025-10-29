let moveSlider;
let sizeSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Slider 1 → controls left-right movement
  moveSlider = createSlider(-200, 200, 0);
  moveSlider.position(20, 20);

  // Slider 2 → controls circle size (opposite scaling)
  sizeSlider = createSlider(5, 500, 10); // min, max, start
  sizeSlider.position(20, 50);
}

function draw() {
  background(15, 15, 15, 15);

  // Read slider values
  let moveValue = moveSlider.value();
  let sizeValue = sizeSlider.value();

  // Map movement for left and right circles
  let leftX = map(moveValue, -100, 0, width * 0.25, width * 0.5);
  let rightX = map(moveValue, -100, 0, width * 0.75, width * 0.5);

  // Opposite scaling
  let MAX = min(width, height) * 1.1;
  let leftSize = map(sizeValue, 10, 500, 50, 600);   // grows
  let rightSize = map(sizeValue, 10, 500, 600, 50);  // shrinks

  ellipseMode(CENTER);

  // --- LEFT SIDE (red) ---
  fill(225, 39, 39);
   ellipse(rightX, height / 2 - 300, rightSize, rightSize);
   ellipse(width / 2, height / 2 + 300, rightSize, rightSize);

  // --- MIDDLE (grey, stays static) ---
  fill(122,112,112);
  ellipse(width / 2, height / 2 - 300, leftSize, leftSize);
 
  ellipse(leftX, height / 2, leftSize, leftSize);


  // --- RIGHT SIDE (white) ---
  fill(234, 234, 234);
  ellipse(leftX, height / 2 - 300, leftSize, leftSize);
  ellipse(leftX, height / 2 + 300, leftSize, leftSize);
   ellipse(width / 2, height / 2, leftSize, leftSize);
  ellipse(rightX, height / 2, leftSize, leftSize);
  ellipse(rightX, height / 2 + 300, leftSize, leftSize);
}
