// Global configs, set here to override default values
let seed;

// GLOBAL DATA
let latestGitVersion;
let shapes = [];
let config;
let filledArea = 0;

function setup() {
    config = new Config({
        seed
    });
    config.setSeed();

    createCanvas(config.canvasWidth, config.canvasHeight);
    colorMode(RGB, 255, 255, 255, 1);
    angleMode(RADIANS);
    ellipseMode(RADIUS);


    console.debug(config);

    let flagSelect = createSelect(false);
    for(let i = 0; i < config.supportedFlags.length; i++){
        flagSelect.option(config.supportedFlags[i]);
    }
    flagSelect.selected(config.whichFlag);
    flagSelect.input(function () {
        config.setWhichFlag(flagSelect.value());
        redraw();
    });

    makeSlider("targetPercentFilled", 0, 1, 0.05, config.getTargetPercentFilled, config.setTargetPercentFilled);

    let saveButton = createButton("save");
    saveButton.mouseClicked(saveArt);


    for (let i = 0; i < config.numShapes; i++) {
        maybeAddShape(config);
    } 
}

function maybeSpawnShape() {
    let x = floor(random(width));
    let y = floor(random(height));
    let r = maxRadius(x, y);
    
    if (r === -1) {
        return -1;
    }
    return new Shape({x:x, y:y, r:r});
}

function maybeAddShape(){
    let maybe = maybeSpawnShape();
    if(maybe != -1){
        filledArea +=  PI * maybe.boundingCircle.r ** 2;
        shapes.push(maybe);
    }
}
function maxRadius(x, y) {
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


function makeSlider(name, minimum, maximum, delta, getter, setter) {
    let d = createDiv();

    let label = createElement("label");
    let textBox = createInput(getter.apply(config), "number");
    textBox.style("width", "100px");
    textBox.attribute("step", delta);
    let slider = createSlider(minimum, maximum, getter.apply(config), delta);
    label.html(name);
    label.attribute("for", slider.id());
    slider.input(function () {
        setter.apply(config, [slider.value()]);
        textBox.value(slider.value());
        redraw();
    });
    textBox.input(function () {
        let value = parseFloat(textBox.value());
        setter.apply(config, [value]);
        slider.value(value);
        redraw();
    });
    d.child(label);
    d.child(slider);
    d.child(textBox);
    return slider;
}

function colorAtPoint(x,y) {

}



function draw() {
    console.debug(config.seed);

    for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        shape.display();
    }
    if(config.targetAreaFilled() > filledArea){
        maybeAddShape();
    }
}
