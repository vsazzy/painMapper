/* eslint-disable import/no-unresolved */

import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';

import * as RECURRENCE from 'utils/recurrenceStrings';
import PainMapQuestions from 'components/Organisms/PainMapQuestions';
import AppHeader from 'components/Organisms/AppHeader';
import PainMapCanvas from 'components/Organisms/PainMapCanvas';
import ResultsContext from 'contexts/resultsContext';
import PainData from 'dataClasses/PainData';
import { painMapResultsScreenName } from 'utils/screenNames';
import styles from './PainMap.style';

const TITLE_HEIGHT = 90;
const MIN_CONTROLS_WIDTH = 300;

function checkPortrait() {
  const dim = Dimensions.get('window');
  return dim.height >= dim.width;
}

function PainMap({ navigation }) {
  const resultsContext = React.useContext(ResultsContext);
  const [isPortrait, setIsPortrait] = useState(checkPortrait());
  const [paintColor, setPaintColor] = useState('rgb(255, 255, 0)'); // default to css "yellow"
  const [intensity, setIntensity] = useState(0);
  const [recurrence, setRecurrence] = useState(RECURRENCE.DAILY);
  const [scaledCanvasInfo, setScaledCanvasInfo] = useState(null);
  const [painImageData, setPainImageData] = useState("null");
  const [wipeCanvas, setWipeCanvas] = useState(false);
  const [savePain, setSavePain] = useState(false);

  // Event Listener for orientation changes
  Dimensions.addEventListener('change', () => {
    setIsPortrait(checkPortrait());
  });

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const availableHeight = windowHeight - TITLE_HEIGHT;
  let availableWidth;
  let flexDirection;

  if (isPortrait) {
    availableWidth = windowWidth;
    flexDirection = 'column';
  } else {
    availableWidth = windowWidth - MIN_CONTROLS_WIDTH;
    flexDirection = 'row';
  }

  function saveData() {
    const painData = new PainData({
      severity: intensity,
      recurrence,
      canvasInfo: scaledCanvasInfo, // hack to make deep copy
      imageData: painImageData.slice(0), // hack to not copy references 
      painColour: paintColor,
    });
    console.log('saving painData', painData.severity, painData.recurrence, painData.painColour, painData.imageData);
    resultsContext.addPainData(painData);
    setWipeCanvas(true);
  }

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} text={`Pain Map ${resultsContext.painData.length + 1}`} />
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ flex: 1, flexDirection }}>
        <PainMapCanvas
          style={{ width: availableWidth }}
          brushPaintColor={paintColor}
          availableHeight={availableHeight}
          availableWidth={availableWidth}
          painImageData={painImageData}
          setPainImageData={setPainImageData}
          scaledCanvasInfo={scaledCanvasInfo}
          setScaledCanvasInfo={setScaledCanvasInfo}
          shouldReset={wipeCanvas}
          setShouldReset={setWipeCanvas}
          savePain={savePain}
          setSavePain={setSavePain}
        />
        <PainMapQuestions
          painIntensity={intensity}
          painRecurrence={recurrence}
          onSeverityChange={(newIntensity, newPaintColor) => {
            setIntensity(newIntensity);
            setPaintColor(newPaintColor);
            setSavePain(true);
          }}
          onRecurrenceChange={(newRecurrence) => {
            setRecurrence(newRecurrence);
          }}
          onNext={() => {
            saveData();
          }}
          onDone={() => {
            saveData();
            navigation.navigate(painMapResultsScreenName);
          }}
          onDelete={() => {
            setWipeCanvas(true);
          }}
        />
      </View>
    </View>
  );
}

export default PainMap;
