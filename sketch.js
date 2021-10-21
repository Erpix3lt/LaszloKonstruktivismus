function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
}

function draw() {
    background(0);

    let locX = mouseX - width / 2;
    let locY = mouseY - height / 2;
    pointLight(255, 255, 255, locX, locY, 50);

    emissiveMaterial(130, 230, 0);
    box(200);
    createCylinder();

    camera(mouseX, mouseY, 40)
}

function createCylinder(){
    for (var i = 0; i < windowHeight; i = i + windowHeight / 10) {
        translate(30, i);
        rotateX(frameCount * 0.01);
        rotateZ(frameCount * 0.01);
        specularMaterial(250);
        shininess(50);
        cylinder(20, windowWidth);
    }   
}