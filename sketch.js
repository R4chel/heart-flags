// Global configs, set here to override default values
let seed;

// GLOBAL DATA
let latestGitVersion;
let shapes = [];
let config;

function setup() {
    config = new Config({
        seed
    });
    config.setSeed();

    createCanvas(config.canvasWidth, config.canvasHeight);
    colorMode(HSB, 360, 100, 100, 1);
    angleMode(RADIANS);
    ellipseMode(RADIUS);

    let saveButton = createButton("save");
    saveButton.mouseClicked(saveArt);
    createP(config.canvasName);


    for (let i = 0; i < config.numShapes; i++) {
        shapes.push(
            new Shape({x:random(config.canvasWidth), y: random(config.canvasHeight), r:random(5, config.canvasHeight / 5)})
        )
    }
}

function saveArt() {
    console.log("saved");
    let name =
        config.canvasName + "--seed-" + config.seed;
    saveCanvas(canvas, name, "png");
}

function draw() {
    console.debug(config.seed);

    for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        shape.display();
    }
}
