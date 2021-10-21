let lazslo;

export default function (p) {
  let canvasWidth = 200;
  let canvasHeight = 300;
  p.preload = function preload() {
    p.lazslo = p.loadModel("assets/Konstrukt_01.obj");
  };

  p.setup = function setup() {
    var canvas = p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    canvas.parent("c1");
  };

  p.draw = function draw() {
    p.background(200);
    p.scale(50);
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.01);
    p.model(p.lazslo);
  };
}
