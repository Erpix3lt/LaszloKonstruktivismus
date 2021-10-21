var canvasWidth;
var canvasHeight;

export default function (p) {
  p.setup = function setup() {
    var canvas = p.createCanvas(
      window.innerWidth / 2,
      window.innerHeight,
      p.WEBGL
    );
    canvas.parent("c2");
    p.noStroke();
  };

  p.draw = function draw() {
    p.background(0);

    let locX = p.mouseX - p.width / 2;
    let locY = p.mouseY - p.height / 2;
    p.pointLight(255, 255, 255, locX, locY, 50);
    p.ambientLight(30);

    p.translate(p.width / 2, -p.height / 2);
    p.specularMaterial(250);
    p.shininess(50);
    p.sphere(300);

    p.translate(-p.width / 2, +p.height / 2);
    p.translate(-p.width / 2, +p.height / 2);
    p.specularMaterial("black");
    p.shininess(50);
    p.sphere(300);

    p.translate(p.width / 2, -p.height / 2);

    for (var i = 0; i < p.width; i = i + p.width / 6) {
      createStarShip(i, 0);
    }
  };

  function createStarShip(x, y) {
    p.translate(x, y);
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.01);
    p.emissiveMaterial(130, 230, 0);
    p.specularMaterial("yellow");
    p.shininess(50);
    p.plane(40, p.height / 2);
    p.specularMaterial("blue");
    p.shininess(50);
    p.plane(p.height / 3, 40);
    p.rotateY(180);
    p.specularMaterial("grey");
    p.shininess(50);
    p.plane(p.height / 3, 40);
  }
}
