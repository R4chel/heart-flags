// Global configs, set here to override default values
let seed = 0;
MIN_RADIUS = 5;

// GLOBAL DATA
let latestGitVersion;
let shapes = [];
let config;
let filledArea = 0;
let percentFilled = 0;
let percentFilledP;

function setup() {
    config = new Config({
        seed
    });
    config.setSeed();

    let canvas = createCanvas(config.canvasWidth, config.canvasHeight);
    canvas.mouseClicked(canvasMouseClicked);
    colorMode(RGB, 255, 255, 255, 1);
    angleMode(RADIANS);
    ellipseMode(RADIUS);


    console.debug(config);

    let flagSelect = createSelect(false);
    for (let i = 0; i < config.countryFlags.length; i++) {
        flagSelect.option(config.countryFlags[i]);
    }
    let selectDivider = "---------";

    flagSelect.option(selectDivider);
    flagSelect.disable(selectDivider);
    for (let i = 0; i < config.prideFlags.length; i++) {
        flagSelect.option(config.prideFlags[i]);
    }
    flagSelect.selected(config.whichFlag);
    flagSelect.input(() => {
        config.setWhichFlag(flagSelect.value());
        recolorShapes();
    });
    let d = createDiv();
    percentFilledP = createP();
    updatePercentFilledP();



    makeSlider("Target Percent Filled: ", 0, 1, 0.05, config.getTargetPercentFilled, config.setTargetPercentFilled);


    let restartButton = createButton("restart");
    restartButton.mouseClicked(() => {
        shapes = [];
        filledArea = 0;
        updatePercentFilledP();
        background(config.backgroundColor);
    });


    let saveButton = createButton("save");
    saveButton.mouseClicked(saveArt);
    background(config.backgroundColor);
}

function recolorShapes() {
    let colors = config.flagColors();
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].changeColors(colors); }
}

function updatePercentFilledP() {
    percentFilled = filledArea / config.totalArea();
    percentFilledP.html("Current Approx Percent Filled: " + parseFloat(percentFilled * 100).toFixed(2) + "%");
}
JITTER = 5;
function maybeSpawnShape(x, y) {
    let r = maxRadius(x, y);
    if (r === -1 || r < MIN_RADIUS) {
        return -1;
    }
    return new Shape({
        x: round(x + random(-JITTER, JITTER)),
        y: round(y + random(-JITTER, JITTER)),
        r: r,
        rotation : random(-config.maxRotation, config.maxRotation),
        inscribed: random() < 0.5,
        levels : round(random(0,1)),
        color: colorAtPoint(x, y),
        colors: config.flagColors(),
    });
}

function maybeAddShape(x, y) {
    x = x === undefined ? floor(random(width)) : x;
    y = y === undefined ? floor(random(height)) : y;
    let maybe = maybeSpawnShape(x, y);
    if (maybe != -1) {
        filledArea += PI * maybe.boundingCircle.r ** 2;
        shapes.push(maybe);
        updatePercentFilledP();
    }
}

function maxRadius(x, y) {
    let m = config.maxPossibleRadius;
    if (!config.allowTouchingEdge) {
        let distanceToEdge = min(x, width - x, y, height - y);
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
    console.debug("saved");
    let name =
        config.canvasName + "--" + config.whichFlag.replace(/([^a-z0-9]+)/gi, '-');
    saveCanvas(canvas, name, "png");
}


function makeSlider(name, minimum, maximum, delta, getter, setter) {
    let d = createDiv();

    let label = createElement("label");
    let textBox = createInput(getter.apply(config), "number");
    textBox.style("width", "100px");
    textBox.attribute("step", delta);
    let slider = createSlider(minimum, maximum, getter.apply(config), delta);
    label.html(name);
    label.attribute("for", slider.id());
    slider.input(function() {
        setter.apply(config, [slider.value()]);
        textBox.value(slider.value());
    });
    textBox.input(function() {
        let value = parseFloat(textBox.value());
        setter.apply(config, [value]);
        slider.value(value);
    });
    d.child(label);
    d.child(slider);
    d.child(textBox);
    return slider;
}

function colorAtPoint(x, y, colors) {
    colors = colors === undefined ? config.flagColors() : colors;
    let index = floor(y * colors.length / config.canvasHeight);
    return colors[index];
}

function canvasMouseClicked() {
    maybeAddShape(mouseX, mouseY);
}

SPEED = 10;
function draw() {
    console.debug(config.seed);

    for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        shape.display();
    }
    if (config.targetPercentFilled > percentFilled) {
        for(let i = 0; i < SPEED; i++){
            
            maybeAddShape();
        }
    }
}
