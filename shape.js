NUM_POINTS = 400;
function Shape({x, y, r, inscribed = false}) {
    this.boundingCircle = {x : x , y:y, r:r};
    this.points = fancyHeartPoints(this.boundingCircle, inscribed);

  this.display = function () {

      beginShape();
      for(let i = 0; i < this.points.length; i++){
          let p = this.points[i];
          curveVertex(p.x,p.y);
      }
      endShape(CLOSE);
      ; }
}

function fancyHeartPoints(boundingCircle, inscribed) {
    let radiusRatio = inscribed ? 1.45 : 2.5;
    let r = boundingCircle.r / radiusRatio;
    let x = boundingCircle.x;
    let y = boundingCircle.y + 1.42 * r;
    return polarShapePoints({r: r, x: x, y: y}, fancyHeart);
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
        points.push({x: x, y: y});
    }
    return points;
}
