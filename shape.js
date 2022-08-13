NUM_POINTS = 400;

function Shape({
    x,
    y,
    r,
    inscribed = false
}) {
    this.boundingCircle = {
        x: x,
        y: y,
        r: r
    };
    this.points = computePoints(this.boundingCircle, inscribed);

    this.display = function() {

        beginShape();
        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            curveVertex(p.x, p.y); 
        }
        endShape(CLOSE);
    }
}

function computePoints(boundingCircle, inscribed){
    let points = fancyHeartPoints(boundingCircle, inscribed);
    return rotatePoints(boundingCircle, points, PI);

}
function fancyHeartPoints(boundingCircle, inscribed) {
    let radiusRatio = inscribed ? 1.45 : 2.5;
    let r = boundingCircle.r / radiusRatio;
    let x = boundingCircle.x;
    let y = boundingCircle.y + 1.42 * r;
    return polarShapePoints({
        r: r,
        x: x,
        y: y
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
        let x = amplitude * cos(theta) + circle.x;
        let y = amplitude * sin(theta) + circle.y;
        points.push({
            x: x,
            y: y
        });
    }
    return points;
}

function rotatePoints(boundingCircle, points, theta) {
    let rotatedPoints = [];
    let bx = boundingCircle.x;
    let by = boundingCircle.y;
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let px = p.x - bx;
        let py = p.y - by;
        let x = px * Math.cos(theta) - py * Math.sin(theta);
        let y = px * Math.sin(theta) + py * Math.cos(theta);
        rotatedPoints.push({x: x + bx, y: y + by});
    }
    return rotatedPoints;
}
