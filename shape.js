function Shape({x, y, r}) {
    this.boundingCircle = {x : x , y:y, r:r};

  this.display = function () {
      let c = this.boundingCircle;
      circle(c.x, c.y, c.r);
  }
}
