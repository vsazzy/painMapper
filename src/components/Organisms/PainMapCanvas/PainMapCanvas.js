/* eslint-disable import/no-unresolved */
// TODO: Variable Refactoring - remove unecessary ones and renaming

import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme, ActivityIndicator, Colors, Button } from 'react-native-paper';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
// eslint-disable-next-line import/no-unresolved
import { bodyMaskMaleBoth, bodyMaskMaleBothInverted } from 'utils/base64Images';
// import Toast from 'react-native-simple-toast';
import Brush from './modifiers/Brush';
import Eraser from './modifiers/Eraser';
import Zoom from './modifiers/Zoom';

function PainMapCanvas(props) {
  // todo app propTypes for validation later
  const {
    brushPaintColor,
    availableHeight,
    availableWidth,
    // These should be refactored to use the props names. renaming them to avoid conflicts
    painImageData: paintContextData = null,
    setPainImageData: setPaintContextData,
    scaledCanvasInfo: canvasDimensions,
    setScaledCanvasInfo: setCanvasDimensions,
    shouldReset,
    setShouldReset,
    savePain,
    setSavePain,
  } = props;
  const { colors } = useTheme();
  /*
    originalImageCanvas  -> used to display the original image (human body masks (front and back))

    paintCanvas          -> exclusively contains all paint (data)

    clippingImageContext -> contains clipping image (invertedMaskBase64Image) which is used to remove paint outside the
                            original image
  */
  const [paintContext, setPaintContext] = React.useState(null);
  const [originalImageContext, setOriginalImageContext] = React.useState(null);
  const [clippingImageContext, setClippingImageContext] = React.useState(null);

  const [modifiers, setModifiers] = React.useState([]);
  const [currentModifier, setCurrentModifier] = React.useState(0);

  const [zoomedIn, setZoomedIn] = React.useState(false);
  const [showZoomMessage, setShowZoomMessage] = React.useState(false);
  const [zoomInfo, setZoomInfo] = React.useState(null); // TODO: Replace null with default state

  const [originalCanvasImage, setOriginalCanvasImage] = React.useState(null);
  const [invertedCanvasClippedImage, setInvertedCanvasClippedImage] = React.useState(null);

  const [excessWidth, setExcessWidth] = React.useState(0);
  const [imageStartingPoint, setImageStartingPoint] = React.useState({ x: 0, y: 0 });
  const [debugMode] = React.useState(false);
  const [clippingImageContextData, setClippingImageContextData] = React.useState(null);

  // Image Info
  const [maskBase64Image] = React.useState(bodyMaskMaleBoth);
  const [invertedMaskBase64Image] = React.useState(bodyMaskMaleBothInverted);
  // const [tempImage] = React.useState(handFootMaskMirrored);

  // Allows external components to to us to reset the canvas
  React.useEffect(() => {
    const resetStates = async () => {
      if (shouldReset && setShouldReset !== undefined) {
        if (zoomInfo) {
          // only zoom out if we're zoomed in
          zoomOut(zoomInfo.x, zoomInfo.y, zoomInfo.zoomLevel);
        }
        paintContext.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
        setShouldReset(false);
      }
    };
    resetStates();
  }, [shouldReset, setShouldReset]);

  // Allow external components to update the paint data
  React.useEffect(() => {
    const saveMe = async () => {
      if (savePain && setSavePain !== undefined) {
        savePaintData();
        setSavePain(false);
      }
    };
    saveMe();
  }, [savePain, setSavePain]);

  const styles = StyleSheet.create({
    originalImageCanvas: {
      backgroundColor: colors.components.canvasBackground,
    },
    clippingImageCanvas: {
      backgroundColor: 'transparent',
      position: 'absolute',
    },
    paintCanvas: {
      backgroundColor: 'transparent',
      position: 'absolute',
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttons: {
      flexDirection: 'column',
      position: 'absolute',
      right: 20,
      bottom: 20,
    },
    loader: {
      flex: 2,
    },
  });
  /**
   * Useful function for debugging
   *
   * Console logs values of important variables
   * Draws Image border
   * Drows bounding box for zoom regions
   */
  // eslint-disable-next-line no-unused-vars
  function debuggingInfo() {
    // drawCoordinateSystem(paintContext);

    console.log(`------------------------------------------`);

    console.log(`availableWidth = ${availableWidth}`);
    console.log(`availableHeight = ${availableHeight}`);

    console.log(`originalImageWidth = ${originalImageWidth}`);
    console.log(`originalImageHeight = ${originalImageHeight}`);

    console.log(`Ratio = ${ratio}`);

    console.log(`modifiedImageWidth = ${modifiedImageWidth}`);
    console.log(`modifiedImageHeight = ${modifiedImageHeight}`);

    if (paintContext) {
      console.log(`paintContext.width = ${paintContext.width}`);
      console.log(`paintContext.height = ${paintContext.height}`);
    }

    console.log(`excessWidth = ${excessWidth}`);

    for (let i = 0; i < modifiers.length; i += 1) {
      console.log(`modifiers[${i}] = ${modifiers[i]}`);
    }

    console.log(`------------------------------------------`);

    // draw image outline
    drawImageBorder(paintContext, imageStartingPoint.x, imageStartingPoint.y, modifiedImageWidth, modifiedImageHeight);
  }

  // Only run on first load
  React.useEffect(() => {
    /*
      Given the available height, how must we scale the 'human image' such that it maintains it's
      proportions and fits the entire remaining height?

      Once we calculate that information from an image source, set the state for canvas dimensions
    */
    function setupImageInfo(imageSource = maskBase64Image) {
      // Make this an async promise function instead of a callback just in case we need to chain later
      return new Promise((resolve, reject) => {
        const handleSizes = (originalImageWidth, originalImageHeight) => {
          // Get ratio
          const heightRatio = availableHeight / originalImageHeight;
          const widthRatio = availableWidth / originalImageWidth;
          const ratio = heightRatio <= widthRatio ? heightRatio : widthRatio;

          if (debugMode) {
            console.log(`\noriginalImageWidth = ${originalImageWidth}`);
            console.log(`originalImageHeight = ${originalImageHeight}`);

            console.log(
              `\nwidthRatio = availableWidth / originalImageWidth = ${availableWidth}/${originalImageWidth} = ${widthRatio}`,
            );
            console.log(
              // eslint-disable-next-line max-len
              `heightRatio = availableHeight / originalImageHeight = ${availableHeight}/${originalImageHeight} = ${heightRatio}`,
            );

            console.log(`\nratio = ${ratio}`);
          }

          // Calculate the height and width
          const scaledImageWidth = Math.floor(originalImageWidth * ratio);
          const scaledImageHeight = Math.floor(originalImageHeight * ratio);

          const canvasDimen = {
            height: scaledImageHeight,
            width: scaledImageWidth,
            ratio: scaledImageHeight / scaledImageWidth,
          };

          setCanvasDimensions(canvasDimen);

          return resolve(canvasDimen);
        };

        Image.getSize(imageSource, handleSizes, reject);
      });
    }

    // TODO: Any time the image mask changes we should update, but nothing is set up to redraw yet
    // so that will have to come later.
    setupImageInfo();
  }, []);

  if (modifiers.length > 0 && paintContext !== null) {
    // Paint the paintContext with the new paint brush colour
    modifiers[0].setFill(brushPaintColor);

    paintContext.globalCompositeOperation = 'source-atop';
    paintContext.fillStyle = brushPaintColor;
    paintContext.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    // Set it back to our default operation
    paintContext.globalCompositeOperation = 'source-over';
  }

  function createCanvasImage(canvas, src) {
    const canvasImage = new CanvasImage(canvas);
    canvasImage.src = src;

    return canvasImage;
  }

  function drawImage(ctx, imageToDraw) {
    if (ctx && imageToDraw) {
      ctx.drawImage(
        imageToDraw,
        imageStartingPoint.x,
        imageStartingPoint.y,
        canvasDimensions.width,
        canvasDimensions.height,
      );
    }
  }

  function handleOriginalImageCanvas(canvasRef) {
    if (canvasRef !== null && !originalImageContext) {
      canvasRef.width = canvasDimensions.width; // eslint-disable-line no-param-reassign
      canvasRef.height = canvasDimensions.height; // eslint-disable-line no-param-reassign

      const ctx = canvasRef.getContext('2d');
      setOriginalImageContext(ctx);

      // TODO: We may want to pull out all of the below into its own function for re-use
      // But only if we need to switch masks on the fly.
      const image = createCanvasImage(canvasRef, maskBase64Image);

      image.addEventListener('load', () => {
        drawImage(ctx, image);

        setOriginalCanvasImage(image);
      });
    }
  }

  function handlePaintCanvas(canvasRef) {
    if (canvasRef !== null && !paintContext) {
      canvasRef.width = canvasDimensions.width; // eslint-disable-line no-param-reassign
      canvasRef.height = canvasDimensions.height; // eslint-disable-line no-param-reassign

      const context = canvasRef.getContext('2d');
      setPaintContext(context);

      const image = createCanvasImage(canvasRef, invertedMaskBase64Image);
      // const image = createCanvasImage(canvasRef, tempImage);

      // setInvertedCanvasImage(image);

      image.addEventListener('load', () => {
        console.log(`Initializing Modifiers`);

        setModifiers([new Brush(context, image, 20, brushPaintColor), new Eraser(context), new Zoom(context)]);

        // setting and selecting the default modifier to be the brush
        setCurrentModifier(0); // Brush Modifier has index 0

        // NOTE: We don't yet draw the inverted image on the paintContext here.
        // We draw it when we start painting (in Brush.js so as to enable cutting).
      });
    }
  }

  function handleClippingImageCanvas(canvasRef) {
    if (canvasRef !== null && !clippingImageContext) {
      canvasRef.width = canvasDimensions.width;
      canvasRef.height = canvasDimensions.height;

      const ctx = canvasRef.getContext('2d');
      setClippingImageContext(ctx);

      const image = createCanvasImage(canvasRef, invertedMaskBase64Image);
      // const image = createCanvasImage(canvasRef, tempImage);

      image.addEventListener('load', () => {
        console.log(`invertedMaskBase64Image in clippingImageContext is now loaded`);

        // drawImage(ctx, image);

        setInvertedCanvasClippedImage(image);
      });
    }
  }

  function clearCanvas(ctx) {
    ctx?.clearRect(imageStartingPoint.x, imageStartingPoint.y, canvasDimensions.width, canvasDimensions.height);
  }

  function drawDebugSquares() {
    // set transparency value
    paintContext.globalAlpha = 0.5;

    paintContext.fillStyle = 'green';
    paintContext.fillRect(
      imageStartingPoint.x,
      imageStartingPoint.y,
      paintContext.canvas.width / 2,
      paintContext.canvas.height / 2,
    );

    paintContext.fillStyle = 'red';
    paintContext.fillRect(
      paintContext.canvas.width / 2,
      paintContext.canvas.height / 2,
      paintContext.canvas.width,
      paintContext.canvas.height,
    );

    paintContext.fillStyle = 'white';
    paintContext.font = '30px serif';

    paintContext.fillText(
      `(${paintContext.canvas.width / 2}, ${paintContext.canvas.height / 2})`,
      paintContext.canvas.width / 2,
      paintContext.canvas.height / 2,
    );
    paintContext.globalAlpha = 1;
  }

  function handleTouchMove(event) {
    const xCoordinateTouchEvent = event.nativeEvent.locationX;
    const yCoordinateTouchEvent = event.nativeEvent.locationY;
    if (modifiers[currentModifier]) {
      modifiers[currentModifier].apply(xCoordinateTouchEvent, yCoordinateTouchEvent);
    }
  }

  /**
   * Display a toast (or equivalent) in order to give user feedback
   * Indicates that the user is in zoomed in mode
   */
  function displayZoomMessage() {
    // Toast.show('Click anywhere to Zoom In', Toast.LONG);
    setShowZoomMessage(true);

    if (paintContext && debugMode) {
      drawDebugSquares();
    }
  }

  /**
   * grabs image data from the given canvas as base 64 encoding
   */
  async function getImageDataFromCanvas(canvas) {
    // const context = canvas.getContext('2d');

    // context.save();
    // console.log(`\nEntered getImageDataFromCanvas`);

    let imageData = await canvas.toDataURL();

    // taking care of the known bug by including the quotation marks
    imageData = imageData.slice(1, -1);

    // if (zoomedIn) {
    //   console.log(imageData);
    // }
    // console.log(`Exiting getImageDataFromCanvas`);

    // context.restore();

    return imageData;
  }

  function performZoomToPoint(
    pointX,
    pointY,
    scaleFactor,
    ctx,
    imageToDraw,
    compositeOperation = 'source-over',
    wipeCanvasFirst = true,
  ) {
    if (ctx) {
      if (wipeCanvasFirst) {
        clearCanvas(ctx);
      }

      ctx.save();

      const originalCompositeOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = compositeOperation;

      // calculate transformations
      const doubleScaleFactor = scaleFactor * 2;

      // TODO: Add clamping for maxWidth, maxHeight, minWidth, minHeight, ... to prevent edge overflow

      // Figure out how much to move
      const canvasCenterX = canvasDimensions.width / 2;
      const canvasCenterY = canvasDimensions.height / 2;

      const xOffset = canvasCenterX - pointX;
      const yOffset = canvasCenterY - pointY;

      if (debugMode) {
        if (ctx === paintContext) {
          console.log(`\nPrinting metrics for paintContext`);
        } else if (ctx === originalImageContext) {
          console.log(`\nPrinting metrics for originalImageContext`);
        } else {
          console.log(`\nPrinting metrics for clippingImageContext`);
        }
        console.log(`xOffset = ${xOffset}`);
        console.log(`yOffset = ${yOffset}`);
        console.log(`scaleFactor = ${scaleFactor}`);
      }

      // apply transformations for zooming
      if (zoomedIn && ctx === paintContext) {
        // we want to zoom out now

        ctx.scale(2, 2);

        /** Below,
         * I used 0.5 before. This is equivalent.
         * Does it hold for different scales? WHo knows! Let's test in the morning */
        ctx.translate(pointX * (1 / scaleFactor), pointY * (1 / scaleFactor));

        ctx.scale(1 / doubleScaleFactor, 1 / doubleScaleFactor); // divisor as we're scaling out. *2 because it worked
        ctx.translate(-pointX, -pointY);
      } else {
        // we want to zoom in

        // ctx.scale(scaleFactor, scaleFactor);
        // ctx.translate(xOff, yOff);

        ctx.translate(pointX, pointY);
        ctx.scale(scaleFactor, scaleFactor);
        ctx.translate(-pointX, -pointY);
      }

      // draw the image (now that the canvas is transformed / zoomed)
      if (imageToDraw) {
        drawImage(ctx, imageToDraw);
      }

      ctx.globalCompositeOperation = originalCompositeOperation;

      ctx.restore(); // This is important and if it is commented out, zoom out will break!
    } else {
      console.log(`CTX IS NOT DEFINED OR IS NULL!!!!!!!!!!!!!!!`);
    }
  }

  // async function saveZoomedInInvertedMaskImageData() {
  //   const zoomedInInvertedImageData = await getImageDataFromCanvas(clippingImageContext.canvas);
  //   setClippingImageContextData(zoomedInInvertedImageData);
  // }

  /**
   * wrapper function for performing actual zooming in for all the contexts
   *
   * We zoom in all of the following applying the same tranformation
   * 1. original masks (originalImageContext)
   * 2. painting (paintContext)
   * 3. invertedMaskBase64Image (clippingImageContext)
   *
   * @param {number} pointX x-coordinate of the point in the zoomed out originalImageCanvas that we want to be centered
   * @param {number} pointY y-coordinate of the point in the zoomed out originalImageCanvas that we want to be centered
   * @param {number} scaleFactor
   */
  async function zoomIn(pointX, pointY, scaleFactor) {
    // 3. invertedMaskBase64Image (clippingImageContext)
    // console.log(`Zoom In the invertedMaskBase64Image (clippingImageContext)`);
    performZoomToPoint(pointX, pointY, scaleFactor, clippingImageContext, invertedCanvasClippedImage);

    // We save this zoomedIn invertedMaskBase64Image and pass it on to the brush modifier.
    // There it will be used for cutting.

    const zoomedInInvertedImageData = await getImageDataFromCanvas(clippingImageContext.canvas);
    // NOTE: We use paintContext below as 'Brush' modifier only paints in paintContext
    const transformedInvertedCanvasImage = createCanvasImage(paintContext.canvas, zoomedInInvertedImageData);

    // console.log(`\nGrabbed zoomedIn InvertedMaskImageData (clippingImageContext)`);

    transformedInvertedCanvasImage.addEventListener('load', async () => {
      // console.log(`Finsished Loading transformedInvertedCanvasImage`);

      // now we pass this zoomed in invertedMaskBase64Image (/stencil) to our brush modifier
      modifiers[0].setImageForClipping(transformedInvertedCanvasImage);
      // console.log(`Passed on zoomedIn InvertedMaskImageData (clippingImageContext) to Brush Modifier`);

      // grab the paint data before we clear it
      // NOTE: paintContext basically contains just the paint data, exactly what we want
      const paintData = await getImageDataFromCanvas(paintContext.canvas);
      // console.log(paintData);
      setPaintContextData(paintData);

      // Make new image from paint data
      const dynamicPaintImage = createCanvasImage(paintContext.canvas, paintData);

      // console.log(`\nGrabbed Paint Data`);

      dynamicPaintImage.addEventListener('load', () => {
        // console.log(`Finished Loading dynamicPaintImage`);

        // console.log(`dynamicPaintImage.src  = ${dynamicPaintImage.src}`);

        // 1. original masks (originalImageContext)
        // console.log(`Zoom In the original mask image (originalImageContext)`);
        performZoomToPoint(pointX, pointY, scaleFactor, originalImageContext, originalCanvasImage);

        // 2. painting (paintContext)
        // console.log(`Zoom In the painting (paintContext) - Utilize grabbed paint data`);
        performZoomToPoint(pointX, pointY, scaleFactor, paintContext, dynamicPaintImage);
      });
    });
  }

  // SUPER HACKY LETS REFACTOR THIS
  async function zoomOut(pointX, pointY, scalingFactor) {
    // 3. invertedMaskBase64Image (clippingImageContext)
    console.log(`Zoom In the invertedMaskBase64Image (clippingImageContext)`);

    performZoomToPoint(
      canvasDimensions.width / 2,
      canvasDimensions.height / 2,
      1,
      clippingImageContext,
      invertedCanvasClippedImage,
    );

    // We save this zoomedIn invertedMaskBase64Image and pass it on to the brush modifier.
    // There it will be used for cutting.

    // saveZoomedInInvertedMaskImageData();

    // grab the paint data before we clear it
    // NOTE: paintContext basically contains just the paint data, exactly what we want
    const zoomedInInvertedImageData = await getImageDataFromCanvas(clippingImageContext.canvas);
    // setClippingImageContextData(zoomedInInvertedImageData);

    // Make new image from paint data
    // NOTE: We use paintContext below as 'Brush' modifier only paints in paintContext
    const transformedInvertedCanvasImage = createCanvasImage(paintContext.canvas, zoomedInInvertedImageData);

    transformedInvertedCanvasImage.addEventListener('load', async () => {
      // now we pass this zoomed in invertedMaskBase64Image (/stencil) to our brush modifier
      modifiers[0].setImageForClipping(transformedInvertedCanvasImage);

      const paintData = await getImageDataFromCanvas(paintContext.canvas); // contains zoomed-in paint data

      // pain a big rectangle for this view for future use
      const originalFillStyle = paintContext.fillStyle;
      paintContext.fillStyle = styles.originalImageCanvas.backgroundColor; // using grey
      paintContext.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
      paintContext.fillStyle = originalFillStyle; // reset the fill style to be nice to other devs

      // store the windowBox that blacks out the entire zoomed in region
      const windowBoxData = await getImageDataFromCanvas(paintContext.canvas);

      // Turn base64 data into canvas images
      const originalPaintImage = createCanvasImage(paintContext.canvas, paintContextData);
      const dynamicPaintImage = createCanvasImage(paintContext.canvas, paintData);
      const windowBoxDataImage = createCanvasImage(paintContext.canvas, windowBoxData);

      // clear the canvases without waiting for the images to load
      clearCanvas(paintContext);
      clearCanvas(originalImageContext);

      const imagesLoaded = {
        originalPaintImage: false,
        dynamicPaintImage: false,
        windowBoxDataImage: false,
      };

      const imagesLoadedHandler = async (imageName) => {
        imagesLoaded[imageName] = true;

        if (imagesLoaded.originalPaintImage && imagesLoaded.dynamicPaintImage && imagesLoaded.windowBoxDataImage) {
          // draw the black sillhouettes in the background
          drawImage(originalImageContext, originalCanvasImage);

          // Draw entire zoomed-out, then erase the zoomed-in area, then paint the zoomed-in data
          drawImage(paintContext, originalPaintImage); // paint in the zoomed-out region
          performZoomToPoint(pointX, pointY, scalingFactor, paintContext, windowBoxDataImage, 'destination-out', false); // new content
          performZoomToPoint(pointX, pointY, scalingFactor, paintContext, dynamicPaintImage, 'source-over', false);

          // store this context for future use
          setPaintContextData(await getImageDataFromCanvas(paintContext.canvas));
        }
        // else not all images are loaded
      };

      // add loading listeners and handle the drawing only when they are all loaded
      originalPaintImage.addEventListener('load', () => {
        imagesLoadedHandler('originalPaintImage');
      });
      dynamicPaintImage.addEventListener('load', () => {
        imagesLoadedHandler('dynamicPaintImage');
      });
      windowBoxDataImage.addEventListener('load', () => {
        imagesLoadedHandler('windowBoxDataImage');
      });
    });
  }

  function handleTouchStart(event) {
    // this handler is only for zoom modifier
    // we want this function to trigger only when a zoom region is clicked/selected when bounding boxes are shown

    if (modifiers[currentModifier] && modifiers[currentModifier] instanceof Zoom) {
      const xCoordinateTouchEvent = event.nativeEvent.locationX;
      const yCoordinateTouchEvent = event.nativeEvent.locationY;

      if (debugMode) {
        console.log(`xCoordinateTouchEvent:  ${xCoordinateTouchEvent}`);
        console.log(`yCoordinateTouchEvent:  ${yCoordinateTouchEvent}`);
      }

      if (showZoomMessage) {
        setZoomInfo({ x: xCoordinateTouchEvent, y: yCoordinateTouchEvent, zoomLevel: 2 });
        zoomIn(xCoordinateTouchEvent, yCoordinateTouchEvent, 2);

        setShowZoomMessage(false);
        setZoomedIn(true);
      }

      modifiers[currentModifier].apply(xCoordinateTouchEvent, yCoordinateTouchEvent);
      setCurrentModifier(0);
    }
  }

  async function savePaintData() {
    const paintData = await getImageDataFromCanvas(paintContext.canvas);
    setPaintContextData(paintData);
  }

  function handleTouchEnd() {
    if (zoomedIn === false) {
      // only when zoomed out or we get a "magnified" image when we zoom out
      savePaintData();
    }
  }

  const buttonMarkup = [];
  for (let i = 0; i < modifiers.length; i += 1) {
    const modifier = modifiers[i];
    buttonMarkup.push(
      <Button
        key={modifier.name}
        icon={modifier.icon}
        mode="contained"
        color={i === currentModifier ? colors.components.modifierSelected : colors.components.modifierNotSelected}
        labelStyle={{
          color: i === currentModifier ? colors.components.modTextSelected : colors.components.modTextNotSelected,
        }}
        onPress={async () => {
          setCurrentModifier(i);

          if (modifiers[i] instanceof Zoom) {
            if (!zoomedIn && !showZoomMessage) {
              // allow them to zoom in
              displayZoomMessage();

              console.log(`Saved Paint Data`);
            } else if (zoomedIn) {
              // already Zoomed in now clicking 'zoom out'
              // so we zoom out
              console.log(`\nEntered zoomout if block in zoom button onPress()`);

              // zoomIn(canvasDimensions.width / 2, canvasDimensions.height / 2, 1);
              zoomOut(zoomInfo.x, zoomInfo.y, zoomInfo.zoomLevel);
              setZoomedIn(false);
              setShowZoomMessage(false); // just to be safe
              modifiers[i].apply();

              setCurrentModifier(0);
            }
          }
        }}
      >
        {modifier.name}
      </Button>,
    );
  }

  // Show a spinning loader until the canvas dimensions are calculated
  if (canvasDimensions == null) {
    return <ActivityIndicator style={styles.loader} size="large" animating color={colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <View onTouchMove={handleTouchMove} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <Canvas style={styles.clippingImageCanvas} ref={handleClippingImageCanvas} />
        <Canvas style={styles.originalImageCanvas} ref={handleOriginalImageCanvas} />
        <Canvas style={styles.paintCanvas} ref={handlePaintCanvas} />
      </View>
      <View style={styles.buttons}>{buttonMarkup}</View>
    </View>
  );
}

PainMapCanvas.propTypes = {
  brushPaintColor: PropTypes.string.isRequired,
  availableHeight: PropTypes.number.isRequired,
  availableWidth: PropTypes.number.isRequired,
  painImageData: PropTypes.string, // not required as it is null to start
  setPainImageData: PropTypes.func.isRequired,
  scaledCanvasInfo: PropTypes.object, // todo: Could specify shape?
  setScaledCanvasInfo: PropTypes.func,
  shouldReset: PropTypes.bool.isRequired,
  setShouldReset: PropTypes.func,
  savePain: PropTypes.bool.isRequired,
  setSavePain: PropTypes.func,
};

PainMapCanvas.defaultProps = {
  painImageData: '',
  scaledCanvasInfo: {},
  setScaledCanvasInfo: () => {},
  setShouldReset: () => {},
  setSavePain: () => {},
};

function drawGrid(context, gridDivisions) {
  const { canvas } = context;

  context.beginPath();
  for (let i = 0; i < canvas.width; i += gridDivisions) {
    context.moveTo(i + 0.5, 0);
    context.lineTo(i + 0.5, canvas.height);
  }
  for (let i = 0; i < canvas.height; i += gridDivisions) {
    context.moveTo(0, i + 0.5);
    context.lineTo(canvas.width, i + 0.5);
  }
  context.strokeStyle = 'rgba(0, 0, 0, 0.2);';
  context.stroke();
}

function drawCoordinateSystem(context) {
  if (context != null) {
    //   context.fillStyle = 'white';
    //   context.font = '30px serif';
    //   context.fillText('(10, 10)', 10, 10);
    //   context.fillText('(730, 730)', 730, 730);
    //   context.fillText('(850, 850)', 850, 850);

    const gridDivisions = 100;

    drawGrid(context, gridDivisions);
  }
}

function drawImageBorder(context, imageStartingPointX, imageStartingPointY, imageWidth, imageHeight) {
  if (context) {
    context.strokeStyle = 'red';
    context.strokeRect(imageStartingPointX, imageStartingPointY, imageWidth, imageHeight);
  }
}

export default PainMapCanvas;
// export default zoomedIn;
