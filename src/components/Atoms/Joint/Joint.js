// to have all joint positions and size relative to the image size, the size and positions
// are calculated as fractions of the image dimensions. Those values are only calculated
// after creating the joint to allow for the joints to be created before dimensions are known.
class Joint {
  constructor(
    xMultiplier,
    yMultiplier,
    rDivisor,
    name,
    lineWidth = 2,
    strokeStyle = 'Green',
    highlightStyle = 'LightGreen',
    divisor = 100,
  ) {
    this.xMultiplier = xMultiplier;
    this.yMultiplier = yMultiplier;
    this.rDivisor = rDivisor;
    this.name = name;
    this.lineWidth = lineWidth;
    this.strokeStyle = strokeStyle;
    this.highlightStyle = highlightStyle;
    this.divisor = divisor;
    this.isHighlighted = false;
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.ailments = [];
    this.context = null;
  }

  static copy(joint) {
    const newJoint = new Joint(joint.xMultiplier, joint.yMultiplier, joint.rDivisor, joint.name);
    newJoint.lineWidth = joint.lineWidth;
    newJoint.strokeStyle = joint.strokeStyle;
    newJoint.highlightStyle = joint.highlightStyle;
    newJoint.divisor = joint.divisor;
    newJoint.isHighlighted = false;
    newJoint.x = joint.x;
    newJoint.y = joint.y;
    newJoint.r = joint.r;
    newJoint.ailments = joint.ailments;

    return newJoint;
  }

  // This sets the x and y coordinates and the radius based on the image dimensions.
  updateCoords(imgWidth, imgHeight) {
    this.x = (this.xMultiplier * imgWidth) / this.divisor;
    this.y = (this.yMultiplier * imgHeight) / this.divisor;
    this.r = imgHeight / this.rDivisor;
  }

  setIsHighlighted(isHighlighted) {
    this.isHighlighted = isHighlighted;
  }

  draw(ctx = null) {
    if (ctx !== null || this.context !== null) {
      if (ctx !== null) {
        this.context = ctx;
      }
      this.drawAilments(this.context);
      this.context.lineWidth = this.lineWidth;
      this.context.beginPath();
      this.context.strokeStyle = this.isHighlighted ? this.highlightStyle : this.strokeStyle;
      this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      this.context.stroke();
    }
  }

  isTouching(xPos, yPos) {
    const xInside = xPos <= this.x + this.r + this.lineWidth && xPos >= this.x - this.r - this.lineWidth;
    const yInside = yPos <= this.y + this.r + this.lineWidth && yPos >= this.y - this.r - this.lineWidth;
    return xInside && yInside;
  }

  addAilment(name, colour) {
    this.ailments.push({ name, colour });
    this.ailments.sort((a, b) => a.name.localeCompare(b.name));
  }

  removeAilment(name) {
    this.ailments = this.ailments.filter((ailment) => ailment.name !== name);
  }

  hasAilment(name) {
    return undefined !== this.ailments.find((ailment) => ailment.name === name);
  }

  hasAilments() {
    return this.ailments.length > 0;
  }

  drawAilments(ctx) {
    const sectSize = (2 * Math.PI) / this.ailments.length;
    for (let i = 0; i < this.ailments.length; i += 1) {
      const ailment = this.ailments[i];
      const start = i * sectSize;
      const end = (i + 1) * sectSize;
      ctx.beginPath();
      ctx.fillStyle = ailment.colour;
      ctx.arc(this.x, this.y, this.r, start, end);

      // these next two lines turn the shape into a wedge if there are more than 2 ailments
      ctx.lineTo(this.x, this.y);
      ctx.closePath();

      ctx.fill();
    }
  }

  ailmentsString() {
    let text = '';

    if (this.hasAilments()) {
      text += this.ailments[0].name.toLowerCase();
      for (let i = 1; i < this.ailments.length; i += 1) {
        text += `, ${this.ailments[i].name.toLowerCase()}`;
      }
    }

    return text;
  }
}

export default Joint;
