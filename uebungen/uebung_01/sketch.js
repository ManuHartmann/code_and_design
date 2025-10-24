let durchmesser;
durchmesser = 10;

let rotwert = 0;

let w = 150;              // animated rect width
let growing = true;       // direction flag
let animate = false; 


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(10, 10, 10);

  console.log(rotwert)

  //mouseX
  //mouseY

  fill(255, 100.50)
  rect(200, 200, 100, 100);
  circle(mouseX, mouseY, durchmesser, durchmesser);

// y = 0
fill(173, 54, 49);    rect(0,   0, 100, 100);   // faded neon red
fill(38, 66, 78);     rect(200, 0, 100, 100);   // taxi teal-blue
fill(215, 142, 80);   rect(400, 0, 100, 100);   // dim amber
fill(102, 123, 132);  rect(600, 0, 100, 100);   // smoke mist blue

// y = 100
fill(134, 87, 90);    rect(100, 100, 100, 100); // crowd rose
fill(85, 92, 97);     rect(300, 100, 100, 100); // wet concrete gray
fill(20, 24, 26);     rect(500, 100, 100, 100); // deep asphalt black
fill(38, 66, 78);     rect(700, 100, 100, 100);

// y = 200
fill(215, 142, 80);   rect(0,   200, 100, 100);
fill(102, 123, 132);  rect(200, 200, 100, 100);
fill(173, 54, 49);    rect(400, 200, 100, 100);
fill(85, 92, 97);     rect(600, 200, 100, 100);

// y = 300
fill(20, 24, 26);     rect(100, 300, 100, 100);
fill(134, 87, 90);    rect(300, 300, 100, 100);
fill(38, 66, 78);     rect(500, 300, 100, 100);
fill(215, 142, 80);   rect(700, 300, 100, 100);

// y = 400
fill(102, 123, 132);  rect(0,   400, 100, 100);
fill(173, 54, 49);    rect(200, 400, 100, 100);
fill(85, 92, 97);     rect(400, 400, 100, 100);
fill(20, 24, 26);     rect(600, 400, 100, 100);

// y = 500
fill(134, 87, 90);    rect(100, 500, 100, 100);
fill(38, 66, 78);     rect(300, 500, 100, 100);
fill(215, 142, 80);   rect(500, 500, 100, 100);
fill(102, 123, 132);  rect(700, 500, 100, 100);

// y = 600
fill(173, 54, 49);    rect(0,   600, 100, 100);
fill(85, 92, 97);     rect(200, 600, 100, 100);
fill(20, 24, 26);     rect(400, 600, 100, 100);
fill(134, 87, 90);    rect(600, 600, 100, 100);



  fill(123, 92, 63);
  ellipse(450, 215, 120, 60);

  rect(200, 400, 100, 100);
  fill(64, 64, 64);
  noStroke();
 rect(365, 400, w, 100, 10);

  fill(30, 30, 30);


  triangle(180, 220, 250, 150, 100, 3);

  fill(255, 0, 255);

  quad(90, 570, 20, 430, 150, 390, 200, 450);

  point(70, 20);

  strokeWeight(1);


   if (animate) {
    if (growing) {
      w += 2;
      if (w >= 300) growing = false;
    } else {
      w -= 2;
      if (w <= 20) growing = true;
    }
  }

}

function mousePressed() {
  if (mouseButton === LEFT) {
    durchmesser = durchmesser + 30;
  }
  if (mouseButton === RIGHT) {
    durchmesser = max(0, durchmesser - 100);
  }

  if (mouseIsPressed) {
    w = constrain(w + 3, 20, 300); // grows only while clicking
  }


}