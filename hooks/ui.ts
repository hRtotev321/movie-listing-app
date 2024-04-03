import { Dimensions } from "react-native";

export const useDimensions = () => {
  const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");
  return {
    screenHeight,
    screenWidth,
  };
};
