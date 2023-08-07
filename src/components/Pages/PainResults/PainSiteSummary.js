import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Title, Paragraph, ProgressBar, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { bodyMaskMaleBoth } from 'utils/base64Images';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

function PainSiteSummary(props) {
  const { painDataList = [] } = props;
  const { colors } = useTheme();

  const [availableWidth, setAvailableWidth] = React.useState(null);
  const [, setRenderContext] = React.useState(null);

  const canvasInfo = painDataList[0]?.canvasInfo || { height: 150, width: 300, ratio: 0.7676470588235295 };
  const padding = 16; // This padding was observed on the iPad not sure how it will scale.

  async function drawImage(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    const backgroundImage = new CanvasImage(canvas, canvasInfo.height, canvasInfo.width);
    backgroundImage.src = imageData;

    // wrap our callback in a promise so we can make it async
    return new Promise((resolve, reject) => {
      backgroundImage.addEventListener('load', () => {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        return resolve();
      });
    });
  }

  async function handleCanvas(canvas) {
    if (canvas) {
      const preferredWidth = availableWidth;
      canvas.width = Math.floor(preferredWidth);
      canvas.height = Math.floor(preferredWidth * canvasInfo.ratio);

      const ctx = canvas.getContext('2d');
      setRenderContext(ctx);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      await drawImage(canvas, bodyMaskMaleBoth);

      for (let i = 0; i < painDataList.length; i++) {
        await drawImage(canvas, painDataList[i].imageData);
      }
    }
  }

  const styles = StyleSheet.create({
    cardContent: { padding },
    row: { flexDirection: 'row' },
    infoBox: { padding: 10, margin: 5, flex: 1 },
    canvas: {
      backgroundColor: colors.components.canvasBackground,
    },
    textTitleCase: { textTransform: 'capitalize' },
  });

  return (
    <View>
      <Card>
        <Card.Title title="Pain Site Map Summary" subtitle={`Total sites: ${painDataList.length}`} />
        <Card.Content
          style={styles.cardContent}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setAvailableWidth(width - 2 * padding);
          }}
        >
          <Surface>
            <Canvas style={styles.canvas} ref={handleCanvas} />
          </Surface>
        </Card.Content>
      </Card>
    </View>
  );
}

export default PainSiteSummary;
