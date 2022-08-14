NUM_POINTS = 400;
CONCENTRIC_FACTOR = 0.7;

function Shape({
    x,
    y,
    r,
    colors,
    levels,
    rotation,
    inscribed
}) {
    this.boundingCircle = {
        x: x,
        y: y,
        r: r
    };
    // pointsWithoutCenter are non-translated points
    this.pointsWithoutCenter = computePoints(this.boundingCircle, inscribed, rotation);
    this.colors = colors;
    this.colorIndex = floor(this.boundingCircle.y * colors.length / height);
    this.levels = levels;
    this.nested = computeNestedPoints(this.boundingCircle, this.pointsWithoutCenter, this.colors, this.levels);
    this.dirty = true;

    this.changeColors = function(colors) {
        this.colors = colors;
        this.colorIndex = floor(this.boundingCircle.y * this.colors.length / height);
        while (this.nested.length <= this.levels * this.colors.length) {
            this.nested.push({
                points: scaleAndTranslatePoints(this.boundingCircle, this.pointsWithoutCenter, CONCENTRIC_FACTOR ** (this.nested.length + 1))
            });

        }
        this.dirty = true;
    }

    this.display = function() {
        if (this.dirty) {

            colorIndex = this.colorIndex;
            strokeWeight(0.5);
            stroke(this.colors[(colorIndex + 1) % this.colors.length]);
            for (let j = 0; j < this.levels * this.colors.length + 1; j++) {
                let points = this.nested[j].points;
                fill(this.colors[colorIndex % this.colors.length]);
                beginShape();
                for (let i = 0; i < points.length; i++) {
                    let p = points[i];
                    curveVertex(p.x, p.y);
                }
                endShape(CLOSE);

                // only draw an outline around the largest shape
                noStroke();

                colorIndex++;


            }
            // noFill();
            // stroke("red");
            // circle(this.boundingCircle.x,this.boundingCircle.y, this.boundingCircle.r);
        }
        this.dirty = false;
    }

}

function computePoints(boundingCircle, inscribed, rotation) {
    let points = fancyHeartPoints(boundingCircle, inscribed);
    return rotatePoints(points, PI + rotation);
}

function fancyHeartPoints(boundingCircle, inscribed) {
    let radiusRatio = inscribed ? 1.45 : 2.5;
    let r = boundingCircle.r / radiusRatio;
    let x = 0;
    let y = 1.42 * r;
    return polarShapePoints({
        r: r,
        x: 0,
        y: y,
    }, fancyHeart);
}

function fancyHeart(scale, t) {
    // source : https://pavpanchekha.com/blog/heart-polar-coordinates.html
    // note: looks bad if numPoints < 360
    let r = (Math.sin(t) * Math.sqrt(Math.abs(Math.cos(t)))) / (Math.sin(t) + 7 / 5) - 2 * Math.sin(t) + 2;
    return r * scale;
}

function polarShapePoints(circle, f) {
    let points = [];

    for (let i = 0; i < NUM_POINTS; i++) {
        let theta = (i * 2 * PI) / NUM_POINTS;
        let amplitude = f(circle.r, theta);
        let x = amplitude * cos(theta);
        let y = amplitude * sin(theta);
        points.push({
            // This is not actually adding the center but the offset from the center
            x: x + circle.x,
            y: y + circle.y
        });
    }
    return points;
}

function rotatePoints(points, theta) {
    let rotatedPoints = [];
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let px = p.x;
        let py = p.y;
        let x = px * Math.cos(theta) - py * Math.sin(theta);
        let y = px * Math.sin(theta) + py * Math.cos(theta);
        rotatedPoints.push({
            x: x,
            y: y
        });
    }
    return rotatedPoints;
}

function scaleAndTranslatePoints(boundingCircle, points, scalar) {
    let scaledPoints = [];
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let px = p.x;
        let py = p.y;
        let x = px * scalar;
        let y = py * scalar;
        scaledPoints.push({
            x: x + boundingCircle.x,
            y: y + boundingCircle.y
        });
    }
    return scaledPoints;

}

function computeNestedPoints(boundingCircle, points, colors, levels) {
    let nested = [];
    let scalar = 1;
    while (nested.length <= levels * colors.length + 1) {
        nested.push({
            points: scaleAndTranslatePoints(boundingCircle, points, scalar)
        });
        scalar *= CONCENTRIC_FACTOR;
    }
    return nested;

}
