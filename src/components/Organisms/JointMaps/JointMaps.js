/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import JointMapCanvas from 'components/Molecules/JointMapCanvas';
import JointMapControls from 'components/Organisms/JointMapControls';
import { checkPortrait } from 'utils/utilityFuncs';
import JointMapQuestions from 'components/Organisms/JointMapQuestions';
import JointButtons from 'components/Molecules/JointButtons';
import { bodyMaskMaleFront, handFootMask, handFootMaskMirrored } from 'utils/base64Images';
import { jointMapResultsScreenName } from 'utils/screenNames';

const TITLE_HEIGHT = 90;
const MIN_CONTROLS_HEIGHT = 300;
const MIN_CONTROLS_WIDTH = 500;
const maleJoints = JointButtons.getJointButtonsMale();
const rightJoints = JointButtons.getJointButtonsRight();
const leftJoints = JointButtons.getJointButtonsLeft();

function JointMaps({ onUpdate, navigation }) {
  const [mapShown, setMapShown] = useState({ body: true, right: false, left: false });
  const [isPortrait, setIsPortrait] = useState(checkPortrait());
  const [jointSelected, setJointSelected] = useState(null);
  const [updateCanvas, setUpdateCanvas] = useState(true);
  const results = maleJoints.getResultsArray().concat(rightJoints.getResultsArray(), leftJoints.getResultsArray());

  React.useEffect(() => {
    // add listener to unfocus event to save data when leaving the screen
    const unsubscribe = navigation.addListener('blur', () => {
      if (onUpdate) {
        onUpdate({
          right: rightJoints.getSaveData(),
          body: maleJoints.getSaveData(),
          left: leftJoints.getSaveData(),
        });
      }
    });

    return unsubscribe;
  }, [navigation, onUpdate]);

  // TODO: Refactor results and getResults into states, possibly using reducers to make it easier to manage
  function getResults() {
    return maleJoints.getResultsArray().concat(rightJoints.getResultsArray(), leftJoints.getResultsArray());
  }

  function onButtonPressBody() {
    setMapShown({
      body: true,
      right: false,
      left: false,
    });
  }

  function onButtonPressRight() {
    setMapShown({
      body: false,
      right: true,
      left: false,
    });
  }

  function onButtonPressLeft() {
    setMapShown({
      body: false,
      right: false,
      left: true,
    });
  }

  function onJointPress(joint) {
    jointSelected?.setIsHighlighted(false);
    joint.setIsHighlighted(true);
    setJointSelected(joint);
  }

  function onPressDone() {
    jointSelected?.setIsHighlighted(false);
    setJointSelected(null);
    if (onUpdate) {
      const data = getResults();
      onUpdate(data);
    }
  }

  function refreshCanvas() {
    setUpdateCanvas(!updateCanvas);
  }

  // Event Listener for orientation changes
  Dimensions.addEventListener('change', () => {
    setIsPortrait(checkPortrait());
  });

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  let flexDirection;
  let jointMapComponents;
  let controls;

  let availableHeight = windowHeight - TITLE_HEIGHT;
  let availableWidth = windowWidth;

  if (isPortrait) {
    availableHeight -= MIN_CONTROLS_HEIGHT;
  } else {
    availableWidth -= MIN_CONTROLS_WIDTH;
  }

  function getCanvasComponent(key, joints, image) {
    return (
      <JointMapCanvas
        key={key}
        availableHeight={availableHeight}
        availableWidth={availableWidth}
        onJointPress={onJointPress}
        joints={joints}
        imageString={image}
      />
    );
  }

  const rightComponent = getCanvasComponent('right', rightJoints, handFootMask);
  const leftComponent = getCanvasComponent('left', leftJoints, handFootMaskMirrored);
  const bodyComponent = getCanvasComponent('body', maleJoints, bodyMaskMaleFront);
  const controlsResults = (
    <JointMapControls
      onPressRight={onButtonPressRight}
      onPressBody={onButtonPressBody}
      onPressLeft={onButtonPressLeft}
      onPressFinish={() => navigation.navigate(jointMapResultsScreenName)}
      results={results}
      portrait={isPortrait}
    />
  );
  const controlsJoint = (
    <JointMapQuestions joint={jointSelected} onPressDone={onPressDone} updateCanvas={refreshCanvas} />
  );

  // change components based on orientation
  if (isPortrait) {
    flexDirection = 'column';
    if (mapShown.body) {
      jointMapComponents = <>{bodyComponent}</>;
    } else if (mapShown.right) {
      jointMapComponents = <>{rightComponent}</>;
    } else {
      jointMapComponents = <>{leftComponent}</>;
    }
  } else {
    flexDirection = 'row';
    jointMapComponents = (
      <>
        {rightComponent}
        {bodyComponent}
        {leftComponent}
      </>
    );
  }
  if (jointSelected === null) {
    controls = controlsResults;
  } else {
    controls = controlsJoint;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection,
    },
  });

  return (
    <View style={styles.container}>
      {jointMapComponents}
      {controls}
    </View>
  );
}

export default JointMaps;
