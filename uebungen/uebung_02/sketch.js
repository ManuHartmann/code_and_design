let moveSlider;
let sizeSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Slider 1 → controls left-right movement
  moveSlider = createSlider(0, 100, 50);
  moveSlider.position(20, 20);

  // Slider 2 → controls circle size
  sizeSlider = createSlider(50, 300, 100); // min, max, start
  sizeSlider.position(20, 50);
}

function draw() {
  background(220);

  // Read slider values
  let moveValue = moveSlider.value();
  let sizeValue = sizeSlider.value();

  // Map movement for left and right circles
  let leftX = map(moveValue, 0, 100, width * 0.25, width * 0.5);
  let rightX = map(moveValue, 0, 100, width * 0.75, width * 0.5);

  // Draw left circle
  fill(255, 100, 100);
  ellipse(leftX, height / 2, sizeValue, sizeValue);

  // Draw right circle
  fill(100, 150, 255);
  ellipse(rightX, height / 2, sizeValue, sizeValue);
}
