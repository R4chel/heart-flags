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


    for (let i = 0; i < config.numShapes; i++) {
        let maybe = maybeSpawnShape(config);
        if(maybe != -1){
            shapes.push(maybe);
        }
    } 
}

function maybeSpawnShape(config) {
    let x = floor(random(width));
    let y = floor(random(height));
    let r = maxRadius(config, x, y);
    
    if (r === -1) {
        return -1;
    }
    return new Shape({x:x, y:y, r:r});
}


function maxRadius(config, x, y) {
    let m = config.maxPossibleRadius;
    if (!config.allowTouchingEdge) {
        let distanceToEdge = min(x, width - x, y, height- y);
        m = min(m, distanceToEdge);
    }
    for (let i = 0; i < shapes.length; i++) {
        let c = shapes[i].boundingCircle;
        let distance = dist(x, y, c.x, c.y);
        if (distance < c.r) {
            return -1;
        }
        m = min([distance - c.r, m]);
    }
    return m;
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
