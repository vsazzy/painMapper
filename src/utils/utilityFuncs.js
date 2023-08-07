import { Image, Dimensions } from 'react-native';

/*
  Given the available height, how must we scale the image such that it maintains it's
  proportions and fits the entire remaining height?
*/
export function calculateImageScale(availableHeight, availableWidth, imageProperties) {
  const heightRatio = availableHeight / imageProperties.height;
  const widthRatio = availableWidth / imageProperties.width;

  return heightRatio <= widthRatio ? heightRatio : widthRatio;
}

export function calculateImageDimensions(image, availableHeight, availableWidth) {
  const imageProperties = Image.resolveAssetSource(image);
  const ratio = calculateImageScale(availableHeight, availableWidth, imageProperties);
  const width = imageProperties.width * ratio;
  const height = imageProperties.height * ratio;

  return { height, width };
}

export function checkPortrait() {
  const dim = Dimensions.get('window');
  return dim.height >= dim.width;
}
