var canvasWidth;
var canvasHeight;

let img;

function preload() {  
    canvasWidth = windowWidth/2;
    canvasHeight = windowHeight;
}

function setup() {
    var canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    canvas.parent('sketch-div');
    noStroke();
}

function draw() {
    background(0);

    let locX = mouseX - width / 2;
    let locY = mouseY - height / 2;
    pointLight(255, 255, 255, locX, locY, 50);
    ambientLight(30); 
    
    translate(canvasWidth/2, -height/2)
    specularMaterial(250);
    shininess(50);
    sphere(300);

    translate(-canvasWidth/2,+height/2)
    translate(-canvasWidth/2, + height/2);
    specularMaterial("black")
    shininess(50);
    sphere(300);

    translate(canvasWidth/2, -height/2)
    for(var i = 0; i<canvasWidth; i = i+ canvasWidth/6){
        createStarShip(i, 0);
    }

}

function createStarShip(x, y){
    translate(x, y);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    emissiveMaterial(130, 230, 0);
    specularMaterial("yellow")
    shininess(50);
    plane(40, canvasHeight / 2);
    specularMaterial("blue")
    shininess(50);
    plane(canvasHeight/3, 40);
    rotateY(180)
    specularMaterial("grey")
    shininess(50);
    plane(canvasHeight/3, 40);
}
