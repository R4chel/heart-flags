function Config({
    debug,
    seed,
    canvasWidth,
    canvasHeight,
    numShapes,
    canvasName,
    maxPossibleRadius,
    targetPercentFilled,
    whichFlag,
}) {
    this.debug = debug === undefined ? false : debug;
    this.canvasName = canvasName === undefined ? "hearts" : canvasName;
    this.canvasWidth = canvasWidth === undefined ? (debug ? 200 : windowWidth) : canvasWidth;
    this.canvasHeight = canvasHeight === undefined ? (debug ? 200 : windowHeight) : canvasHeight;
    this.numShapes = numShapes === undefined ? 10 : numShapes;
    this.maxPossibleRadius = maxPossibleRadius === undefined ? this.canvasHeight / 10 : maxPossibleRadius;
    this.allowTouchingEdges = false;
    this.targetPercentFilled = targetPercentFilled === undefined ? 0.7 : targetPercentFilled;
    this.supportedFlags = ["Ukraine", "LGBT", "Pansexual", "Trans", "Non-binary"];
    this.whichFlag = whichFlag === undefined ? random(this.supportedFlags) : whichFlag;

    this.seed = seed === undefined ? (debug ? 1 : seed) : seed;
    this.setSeed = function() {
        if (this.seed === undefined) {
            this.seed = round(random(1000000));
        }
        randomSeed(this.seed);
    }

    this.getTargetPercentFilled = function() {
        return this.targetPercentFilled;
    }
    this.setTargetPercentFilled = function(targetPercentFilled) {
        this.targetPercentFilled = targetPercentFilled;
    }
    this.getWhichFlag = function() {
        return this.whichFlag;
    }
    this.setWhichFlag = function(whichFlag) {
        this.whichFlag = whichFlag;
    }

    this.targetAreaFilled = function() {
        return width * height * this.targetPercentFilled;
    }

    this.flagColors = function() {
        switch(this.whichFlag) {
        case "Ukraine": return [color(0, 91, 187, 1), color(255, 213, 0, 1), ];
        case "Non-binary":
            return [color("#FCF434"), color("#FFFFFF"), color("#9C59D1"), color("#2C2C2C")];

        case "Trans":
            return [color("#55CDFC"), color("#F7A8B8"), color("FFFFFF"), color("#F7A8B8"), color("#55CDFC")]
        case "Pansexual":
            return [color("#FF218C"), color("#FFD800"), color("#21B1FF")];
        case "LGBT":
        default:
            return [color("#FF0018"), color("#FFA52C"), color("#FFFF41"), color("#008018"), color("#0000F9"), color("#86007D")]
        }
    }

}
