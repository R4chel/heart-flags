function Config({
    debug,
    seed,
    canvasWidth,
    canvasHeight,
    numShapes,
    canvasName,
    maxPossibleRadius,
    targetPercentFilled,

}) {
    this.debug = debug === undefined ? false : debug;
    this.canvasName = canvasName === undefined ? "hearts" : canvasName;
    this.canvasWidth = canvasWidth === undefined ? (debug ? 200 : windowWidth) : canvasWidth;
    this.canvasHeight = canvasHeight === undefined ? (debug ? 200 : windowHeight) : canvasHeight;
    this.numShapes = numShapes === undefined ? 10 : numShapes;
    this.maxPossibleRadius = maxPossibleRadius === undefined ? this.canvasHeight / 10 : maxPossibleRadius;
    this.allowTouchingEdges = false;
    this.targetPercentFilled = targetPercentFilled === undefined ? 0.7 : targetPercentFilled;

    this.seed = seed === undefined ? (debug ? 1 : seed) : seed;
    this.setSeed = function() {
        if (this.seed === undefined) {
            this.seed = round(random(1000000));
        }
        randomSeed(this.seed);
    }

    this.getTargetPercentFilled = function () {
        return this.targetPercentFilled;
    }
    this.setTargetPercentFilled = function (targetPercentFilled) {
        this.targetPercentFilled = targetPercentFilled;
    }

    this.targetAreaFilled = function() {
        return width * height * this.targetPercentFilled;
    }
}
