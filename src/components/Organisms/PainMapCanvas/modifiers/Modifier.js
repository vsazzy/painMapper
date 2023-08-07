export default class Modifier {
  constructor(context, name, icon) {
    this.context = context;
    this.name = name;
    this.icon = icon;
  }

  setName(name) {
    this.name = name;
  }

  setIcon(icon) {
    this.icon = icon;
  }

  // eslint-disable-next-line class-methods-use-this
  apply() {
    throw new Error('This method must be shadowed by child classes');
  }
}
