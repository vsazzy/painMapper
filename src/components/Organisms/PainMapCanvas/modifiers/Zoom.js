import Modifier from './Modifier';

export default class Zoom extends Modifier {
  constructor(context) {
    const name = 'Zoom In';
    const icon = 'magnify-plus-outline';
    super(context, name, icon);
  }

  apply(xCoordinateTouchEvent, yCoordinateTouchEvent) {
    if (this.name === 'Zoom In') {
      this.name = 'Zoom Out';
      this.icon = 'magnify-minus-outline';
    } else {
      this.name = 'Zoom In';
      this.icon = 'magnify-plus-outline';
    }
  }
}
