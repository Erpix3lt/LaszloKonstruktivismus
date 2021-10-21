let lazslo;

function preload() {
  canvasWidth = 200;
  canvasHeight = 300;
  lazslo = loadModel('assets/Konstrukt_01.obj');
}

function setup() {
  var canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent('sketch-div');
}

function draw() {
  background(200);
  scale(50);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  model(lazslo);

}