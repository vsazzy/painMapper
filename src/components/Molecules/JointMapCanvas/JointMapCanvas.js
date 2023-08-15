import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, StyleSheet } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import { useTheme, ActivityIndicator, Colors } from 'react-native-paper';

import JointManager from 'components/Atoms/JointManager';

function JointMapCanvas(props) {
  const { availableHeight, availableWidth, onJointPress, joints, imageString, style } = props;
  const [image] = React.useState(imageString);
  const [canvasDimensions, setCanvasDimensions] = React.useState(null);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    canvas: {
      backgroundColor: colors.components.canvasBackground,
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.components.canvasBackground,
    },
  });

  // Only run on first load
  React.useEffect(() => {
    /*
      Given the available height, how must we scale the 'image' such that it maintains it's
      proportions and fits the entire remaining height?

      Once we calculate that information from an image source, set the state for canvas dimensions
    */
    function setupImageInfo(imageSource = image) {
      // Make this an async promise function instead of a callback just in case we need to chain later
      return new Promise((resolve, reject) => {
        const handleSizes = (imgWidth, imgHeight) => {
          // Get ratio
          const heightRatio = availableHeight / imgHeight;
          const widthRatio = availableWidth / imgWidth;
          const ratio = heightRatio <= widthRatio ? heightRatio : widthRatio;

          // Calculate the height and width
          const calcWidth = Math.floor(imgWidth * ratio);
          const calcHeight = Math.floor(imgHeight * ratio);

          joints.updateCoords(calcWidth, calcHeight);
          const dimensions = { height: calcHeight, width: calcWidth };
          setCanvasDimensions(dimensions);
          return resolve(dimensions);
        };

        Image.getSize(imageSource, handleSizes, reject);
      });
    }

    // TODO: Any time the image mask changes we should update, but nothing is set up to redraw yet
    // so that will have to come later.
    setupImageInfo();
  }, []);

  function handleCanvas(canvas) {
    if (canvas !== null) {
      const { width, height } = canvasDimensions;
      canvas.width = width; // eslint-disable-line no-param-reassign
      canvas.height = height; // eslint-disable-line no-param-reassign
      const context = canvas.getContext('2d');

      context.clearRect(0, 0, canvas.width, canvas.height);

      const canvasImage = new CanvasImage(canvas);
      canvasImage.src = image;
      canvasImage.addEventListener('load', () => {
        context.drawImage(canvasImage, 0, 0, width, height);
        if (!joints.setPositions) {
          joints.updateCoords(canvasDimensions.width, canvasDimensions.height);
        }
        joints.draw(context);
      });
    }
  }

  function onTouch(event) {
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    const touching = joints.isTouching(x, y);

    if (touching !== null) {
      onJointPress(touching);
    }
  }

  // Show a spinning loader until the canvas dimensions are calculated
  if (canvasDimensions == null) {
    return <ActivityIndicator style={styles.loader} size="large" animating color={colors.green} />;
  }

  return (
    <View style={[styles.container, style]} onTouchEnd={onTouch}>
      <Canvas style={styles.canvas} ref={handleCanvas} />
    </View>
  );
}

JointMapCanvas.propTypes = {
  availableHeight: PropTypes.number.isRequired,
  availableWidth: PropTypes.number.isRequired,
  onJointPress: PropTypes.func.isRequired,
  joints: PropTypes.shape(JointManager).isRequired,
  imageString: PropTypes.string.isRequired,
};

export default JointMapCanvas;
