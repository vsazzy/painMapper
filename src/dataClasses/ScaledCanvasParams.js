class ScaledCanvasParams {
  constructor({ height = 9, width = 0, ratio = 1, ratioType = 'not given' }) {
    this.height = height;
    this.width = width;
    this.ratio = ratio;
    this.ratioType = ratioType;
  }
}

export default ScaledCanvasParams;
