import Joint from 'components/Atoms/Joint';

class JointManager {
  constructor() {
    this.joints = [];
    this.setPositions = false;
  }

  setJoints(array) {
    array.forEach((joint) => {
      this.joints.push(Joint.copy(joint));
    });
    this.setPositions = false;
  }

  updateCoords(imgWidth, imgHeight) {
    this.joints.forEach((joint) => {
      joint.updateCoords(imgWidth, imgHeight);
    });
    this.setPositions = true;
  }

  draw(ctx) {
    this.joints.forEach((joint) => {
      joint.draw(ctx);
    });
  }

  isTouching(xPos, yPos) {
    let touching = null;
    let i = 0;

    let curr = this.joints[i];
    while (touching === null && i < this.joints.length) {
      if (curr.isTouching(xPos, yPos)) {
        touching = curr;
      }
      i += 1;
      if (i < this.joints.length) {
        curr = this.joints[i];
      }
    }

    return touching;
  }

  getResultsArray() {
    const results = [];

    this.joints.forEach((joint) => {
      if (joint.hasAilments()) {
        results.push({
          name: joint.name,
          ailments: joint.ailmentsString(),
        });
      }
    });

    return results;
  }

  getSaveData() {
    const data = [];

    this.joints.forEach((joint) => {
      if (joint.hasAilments()) {
        data.push(joint);
      }
    });

    const manager = new JointManager();
    manager.setJoints(data);
    return manager;
  }
}

export default JointManager;
