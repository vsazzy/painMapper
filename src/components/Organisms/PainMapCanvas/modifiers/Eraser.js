import Modifier from './Modifier';

export default class Eraser extends Modifier {
  constructor(context, size = 30) {
    super(context, 'Eraser', 'eraser');
    this.size = size;
  }

  setSize(size) {
    this.size = size;
  }

  apply(x, y) {
    this.context.clearRect(x - this.size / 2, y - this.size / 2, this.size, this.size);
  }
}
