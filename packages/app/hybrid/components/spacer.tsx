import React, { FC } from "react";
import { View, ViewStyle } from "react-native";

const spacings = {
  'xs': 2,
  's': 4,
  'm': 8,
  'l': 16,
  'xl': 24,
  '2xl': 32,
  '3xl': 42,
}

type SpacingKey = keyof typeof spacings;

interface SpacerProps {
  x?: SpacingKey;
  y?: SpacingKey;
}

const Spacer: FC<SpacerProps> = ({ children, x, y }) => {
  const styles: ViewStyle = {};

  if (x) {
    styles.paddingHorizontal = spacings[x];
  }
  if (y) {
    styles.paddingVertical = spacings[y];
  }

  return <View style={styles}>
    {children}
  </View>
}

export default Spacer;
