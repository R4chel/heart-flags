function Config({
    debug,
    seed,
    canvasWidth,
    canvasHeight,
    canvasName,
    maxPossibleRadius,
    targetPercentFilled,
    whichFlag,
    backgroundColor,
    maxRotation,
}) {
    this.debug = debug === undefined ? false : debug;
    this.canvasName = canvasName === undefined ? "hearts" : canvasName;
    this.canvasWidth = canvasWidth === undefined ? (debug ? 200 : windowWidth) : canvasWidth;
    this.canvasHeight = canvasHeight === undefined ? (debug ? 200 : windowHeight) : canvasHeight;
    this.maxPossibleRadius = maxPossibleRadius === undefined ? this.canvasHeight / 10 : maxPossibleRadius;
    this.allowTouchingEdges = false;
    this.targetPercentFilled = targetPercentFilled === undefined ? 0.7 : targetPercentFilled;
    this.countryFlags = [ "Ukraine" ];
    
    this.prideFlags = [ "LGBT", "Pansexual", "Trans", "Non-binary", "Bisexual", "Lesbian"];
    this.supportedFlags = this.countryFlags + this.prideFlags;
    this.inscribedHearts = true;
    this.backgroundColor = backgroundColor === undefined ? 255 : backgroundColor;
    this.maxRotation = maxRotation === undefined ? PI /10 : maxRotation;
    this.whichFlag = this.whichFlag;

    this.seed = seed === undefined ? (debug ? 1 : seed) : seed;
    this.setSeed = function() {
        if (this.seed === undefined) {
            this.seed = round(random(1000000));
        }
        randomSeed(this.seed);
        this.whichFlag = this.whichFlag === undefined ? random(this.supportedFlags) : this.whichFlag;
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

    this.totalArea = function(){
        return width * height;
    }
    this.targetAreaFilled = function() {
        return width * height * this.targetPercentFilled;
    }



    // Sources for pride flag hex colors:
    // https://www.kapwing.com/resources/official-pride-colors-2021-exact-color-codes-for-15-pride-flags/
    // https://www.flagcolorcodes.com/flags/pride
    this.flagColors = function() {
        switch(this.whichFlag) {
        case "Ukraine": return [color(0, 91, 187, 1), color(255, 213, 0, 1), ];
        case "Non-binary":
            return [color("#FCF434"), color("#FFFFFF"), color("#9C59D1"), color("#2C2C2C")];

        case "Trans":
            return [color("#55CDFC"), color("#F7A8B8"), color("FFFFFF"), color("#F7A8B8"), color("#55CDFC")]
        case "Pansexual":
            return [color("#FF218C"), color("#FFD800"), color("#21B1FF")];
        case "Bisexual":
            return [color("#D60270"),color("#D60270"),color("#9B4F96"),color("#0038A8"),color("#0038A8")];
        case "Lesbian":
            return [color("#D62800"), color("#FF9B56"), color("#FFFFFF"), color("#D462A6"), color("#A40062")];
        case "LGBT":
        default:
            return [color("#FF0018"), color("#FFA52C"), color("#FFFF41"), color("#008018"), color("#0000F9"), color("#86007D")]
        }
    }

}
