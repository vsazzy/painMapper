import Modifier from './Modifier';

export default class Brush extends Modifier {
  constructor(context, imageForClipping, size = 20, fill = 'rgb(255, 255, 0)') {
    console.log(`\nCreated a new Brush - (In Brush.js constructor)`);
    super(context, 'Brush', 'brush');
    this.imageForClipping = imageForClipping;
    this.width = context.canvas.width;
    this.height = context.canvas.height;
    this.size = size;
    this.fill = fill;
  }

  setSize(size) {
    this.size = size;
  }

  setFill(fill) {
    this.fill = fill;
  }

  setImageForClipping(newImage) {
    this.imageForClipping = newImage;
  }

  /**
   * Helper function for removing paint from irrelevant regions
   */
  cut() {
    // console.log(`Performing cut`);
    const originalCompositeOperation = this.context.globalCompositeOperation;

    // console.log(`originalCompositeOperation = ${originalCompositeOperation}`);

    this.context.globalCompositeOperation = 'destination-out';
    // this.context.globalCompositeOperation = 'copy';
    // this.context?.clearRect(0, 0, this.width, this.height);

    // console.log(`this.context.globalCompositeOperation = ${this.context.globalCompositeOperation}`);

    // stencil/cut
    this.context.drawImage(this.imageForClipping, 0, 0, this.width, this.height);

    // this.context.globalCompositeOperation = 'source-atop';
    // this.context.fillStyle = '#ff0000';
    // this.context.fillRect(0, 0, this.width, this.height);
    // this.context.globalCompositeOperation = 'source-over';

    // set type of composting operation back to as it was prior
    this.context.globalCompositeOperation = originalCompositeOperation;
  }

  apply(x, y) {
    this.context.beginPath();
    this.context.fillStyle = this.fill;
    this.context.arc(x, y, this.size, 0, 2 * Math.PI);
    this.context.fill();

    // We have painted wherever we'd like
    // Now we cut/clip out paint from everywhere but on the the mask
    this.cut();
  }

  /**
   * Getter method to save the state of forwardContext
   */
  getContext() {
    return this.context;
  }
}
