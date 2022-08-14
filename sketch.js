// Global configs, set here to override default values
let seed;
let MIN_RADIUS = 5;

// GLOBAL DATA
let latestGitVersion;
let shapes = [];
let config;
let filledArea = 0;
let percentFilled = 0;
let percentFilledP;
let redrawBackground = true;

// I put in global attempts so I could watch it in the debugger, because I was curious. It's fine to remove it. 
let GLOBAL_ATTEMPTS = 0;

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
    for (let i = 0; i < config.prideFlags.length; i++) {
        flagSelect.option(config.prideFlags[i]);
    }
    flagSelect.selected(config.whichFlag);
    flagSelect.disable(selectDivider);
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
        redrawBackground = true;
        GLOBAL_ATTEMPTS = 0;
    });


    let saveButton = createButton("save");
    saveButton.mouseClicked(saveArt);
}

function recolorShapes() {
    let colors = config.flagColors();
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].changeColors(colors);
    }
    redrawBackground = true;
}

function updatePercentFilledP() {
    percentFilled = filledArea / config.totalArea();
    percentFilledP.html("Current Approx Percent Filled: " + parseFloat(percentFilled * 100).toFixed(2) + "%");
}

// JITTER and BUFFER are about parameterizing the overlap of the hearts. Also specifiying if hearts are inscribed also affects this.
JITTER = 5;
BUFFER = -2;

function maybeSpawnShape(x, y, forced = false) {
    let r = maxRadius(x, y);
    if (r === -1 || r < MIN_RADIUS) {
        if (forced) {
            r = round(random(MIN_RADIUS, 2 * MIN_RADIUS + 1));
        } else {
            return -1;
        }
    }

    return new Shape({
        x: round(x + random(-JITTER, JITTER)),
        y: round(y + random(-JITTER, JITTER)),
        r: r,
        rotation: random(-config.maxRotation, config.maxRotation),
        inscribed: random() < 0.75,
        levels: round(random(0, 1)),
        color: colorAtPoint(x, y),
        colors: config.flagColors(),
    });
}

function maybeAddShape(x, y, forced = false) {
    GLOBAL_ATTEMPTS++;
    x = x === undefined ? floor(random(width)) : x;
    y = y === undefined ? floor(random(height)) : y;
    let maybe = maybeSpawnShape(x, y, forced);
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
        if (distance < c.r - BUFFER) {
            return -1;
        }
        m = min([distance - c.r - BUFFER, m]);
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
    let textBox = createInput((getter.apply(config)).toString(), "number");
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
    maybeAddShape(mouseX, mouseY, true);
}

SPEED = 100;

function draw() {
    console.debug(config.seed);
    if (redrawBackground) {
        background(config.backgroundColor);
        redrawBackground = false;
    }

    for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        shape.display();
    }
    if (config.targetPercentFilled > percentFilled) {
        for (let i = 0; i < SPEED; i++) {
            maybeAddShape();
        }
    }
}
