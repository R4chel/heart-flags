function Shape({x, y, r}) {
  this.x = x;
  this.y = y;
  this.r = r;

  this.display = function () {
      circle(x, y, r);
  }
}
