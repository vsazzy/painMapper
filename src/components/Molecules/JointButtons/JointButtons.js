import Joint from 'components/Atoms/Joint';
import JointManager from 'components/Atoms/JointManager';

class JointButtons {
  static getJointButtonsMale() {
    const manager = new JointManager();
    const radiusDivisor = 35;

    manager.setJoints([
      new Joint(45, 12, radiusDivisor, 'Right Upper Neck'),
      new Joint(55, 12, radiusDivisor, 'Left Upper Neck'),
      new Joint(45, 16, radiusDivisor, 'Right Lower Neck'),
      new Joint(55, 16, radiusDivisor, 'Left Lower Neck'),
      new Joint(35, 18, radiusDivisor, 'Right Clavicle'),
      new Joint(65, 18, radiusDivisor, 'Left Clavicle'),
      new Joint(27, 21, radiusDivisor, 'Right Shoulder'),
      new Joint(73, 21, radiusDivisor, 'Left Shoulder'),
      new Joint(23, 33, radiusDivisor, 'Right Elbow'),
      new Joint(77, 33, radiusDivisor, 'Left Elbow'),
      new Joint(12, 49, radiusDivisor, 'Right Wrist'),
      new Joint(88, 49, radiusDivisor, 'Left Wrist'),
      new Joint(37, 52, radiusDivisor, 'Right Hip'),
      new Joint(63, 52, radiusDivisor, 'Left Hip'),
      new Joint(37, 72, radiusDivisor, 'Right Knee'),
      new Joint(63, 72, radiusDivisor, 'Left Knee'),
      new Joint(37, 92, radiusDivisor, 'Right Ankle'),
      new Joint(63, 92, radiusDivisor, 'Left Ankle'),
    ]);

    return manager;
  }

  static getJointButtonsAppendages(isRight) {
    const manager = new JointManager();
    const radiusDivisor = 35;
    // flip coordinates over x = 50
    const axis = isRight ? 50 : -50;
    const sideChar = isRight ? 'R' : 'L';

    // Welcome to Anatomy 1010! Today we will be learning the names of joints in our hands and feet
    // Medial is the inside of the legs and lateral is the outside. This is used in the names of ankle joints
    // Here are links for joint names for fingers and toes
    // Hand: https://www.arthritis.org/health-wellness/about-arthritis/where-it-hurts/hand-and-wrist-anatomy
    // Foot: https://www.arthritis.org/health-wellness/about-arthritis/where-it-hurts/anatomy-of-the-foot
    // the important notes from those pages
    // metacarpophalangeal joint (MCP) – the joint at the base of the finger
    // proximal interphalangeal joint (PIP) –  the joint in the middle of the finger
    // distal interphalangeal joint (DIP)  – the joint closest to the fingertip.
    // Metatarsophalangeal joint (MCP) – the joint at the base of the toe
    // Proximal interphalangeal joint (PIP) – the joint in the middle of the toe
    // Distal phalangeal joint (DP) – the joint closest to the tip of the toe.
    manager.setJoints([
      // hand
      new Joint(Math.abs(axis + 14), 5, radiusDivisor, `${sideChar}H: Wrist`),
      new Joint(Math.abs(axis + -15), 11, radiusDivisor, `${sideChar}H: Thumb Knuckle`),
      new Joint(Math.abs(axis + -33), 18, radiusDivisor, `${sideChar}H: Thumb PIP`),
      new Joint(Math.abs(axis + -14), 22, radiusDivisor, `${sideChar}H: Index Knuckle`),
      new Joint(Math.abs(axis + -22), 28, radiusDivisor, `${sideChar}H: Index PIP`),
      new Joint(Math.abs(axis + -30), 34, radiusDivisor, `${sideChar}H: Index DIP`),
      new Joint(Math.abs(axis + 0), 24, radiusDivisor, `${sideChar}H: Middle Knuckle`),
      new Joint(Math.abs(axis + -7), 32, radiusDivisor, `${sideChar}H: Middle PIP`),
      new Joint(Math.abs(axis + -14), 39, radiusDivisor, `${sideChar}H: Middle DIP`),
      new Joint(Math.abs(axis + 15), 26, radiusDivisor, `${sideChar}H: Ring Knuckle`),
      new Joint(Math.abs(axis + 11), 33, radiusDivisor, `${sideChar}H: Ring PIP`),
      new Joint(Math.abs(axis + 7), 40, radiusDivisor, `${sideChar}H: Ring DIP`),
      new Joint(Math.abs(axis + 29), 23, radiusDivisor, `${sideChar}H: Pinky Knuckle`),
      new Joint(Math.abs(axis + 31), 30, radiusDivisor, `${sideChar}H: Pinky PIP`),
      new Joint(Math.abs(axis + 31), 37, radiusDivisor, `${sideChar}H: Pinky DIP`),
      // foot
      new Joint(Math.abs(axis + -14), 60, radiusDivisor, `${sideChar}F: Lateral Ankle`),
      new Joint(Math.abs(axis + 17), 58, radiusDivisor, `${sideChar}F: Medial Ankle`),
      // If the rest of the toe knuckles get added, the radius for the joints will need to be changed
      // At the very least the joints below here will need to change
      new Joint(Math.abs(axis + -27), 85, radiusDivisor, `${sideChar}F: Pinky Toe Base`),
      new Joint(Math.abs(axis + -29), 90, radiusDivisor, `${sideChar}F: Pinky Toe`),
      new Joint(Math.abs(axis + -15), 88, radiusDivisor, `${sideChar}F: Ring Toe Base`),
      new Joint(Math.abs(axis + -18), 93, radiusDivisor, `${sideChar}F: Ring Toe`),
      new Joint(Math.abs(axis + -5), 89, radiusDivisor, `${sideChar}F: Middle Toe Base`),
      new Joint(Math.abs(axis + -8), 94, radiusDivisor, `${sideChar}F: Middle Toe`),
      new Joint(Math.abs(axis + 8), 88, radiusDivisor, `${sideChar}F: Long Toe Base`),
      new Joint(Math.abs(axis + 5), 93, radiusDivisor, `${sideChar}F: Long Toe`),
      new Joint(Math.abs(axis + 25), 86, radiusDivisor, `${sideChar}F: Big Toe Base`),
      new Joint(Math.abs(axis + 22), 93, radiusDivisor, `${sideChar}F: Big Toe`),
    ]);

    return manager;
  }

  static getJointButtonsRight() {
    return this.getJointButtonsAppendages(true);
  }

  static getJointButtonsLeft() {
    return this.getJointButtonsAppendages(false);
  }
}

export default JointButtons;
