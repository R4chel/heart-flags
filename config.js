function Config({
    debug,
    canvasWidth,
    canvasHeight,
    numShapes,
    canvasName,
    seed
}) {
    this.debug = debug === undefined ? false : debug;
    this.canvasName = canvasName === undefined ? "hearts" : canvasName;
    this.canvasWidth = canvasWidth === undefined ? (debug ? 200 : windowWidth) : canvasWidth;
    this.canvasHeight = canvasHeight === undefined ? (debug ? 200 : windowHeight) : canvasHeight;
    this.numShapes = numShapes === undefined ? 10 : numShapes;
    this.seed = seed === undefined ? (debug ? 1 : seed) : seed;

    this.setSeed = function() {
        if (this.seed === undefined) {
            this.seed = round(random(1000000));
        }
        randomSeed(this.seed);
    }
}
