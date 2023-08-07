import * as RECURRENCE from 'utils/recurrenceStrings';

class PainData {
  constructor({ severity = 0, recurrence = 'daily', canvasInfo = null, imageData = '', id = null, painColour }) {
    this.severity = severity;
    this.painColour = painColour;
    this.recurrence = recurrence;
    this.canvasInfo = canvasInfo;
    this.imageData = imageData;
    this.id = id;
  }

  setId(id) {
    this.id = id;
  }

  getRecurrenceString() {
    switch (this.recurrence) {
      case RECURRENCE.WEEKLY:
        return 'weekly';
      case RECURRENCE.DAILY:
        return 'daily';
      case RECURRENCE.MULTIPLE_PER_DAY:
        return 'mutiple times a day';
      default:
        return 'invalid choie';
    }
  }
}
export default PainData;
