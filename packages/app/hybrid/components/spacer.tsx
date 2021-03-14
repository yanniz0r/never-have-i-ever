import React, { FC } from "react";
import { View, ViewProps, ViewStyle } from "react-native";

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

interface SpacerProps extends ViewProps {
  x?: SpacingKey;
  y?: SpacingKey;
  b?: SpacingKey;
  t?: SpacingKey;
  r?: SpacingKey;
  l?: SpacingKey;
}

const Spacer: FC<SpacerProps> = ({ children, style, x, y, l, r, b, t, ...props }) => {
  const styles: ViewStyle = {};

  if (x) {
    styles.paddingHorizontal = spacings[x];
  }
  if (y) {
    styles.paddingVertical = spacings[y];
  }
  if (b) {
    styles.paddingBottom = spacings[b];
  }
  if (t) {
    styles.paddingBottom = spacings[t];
  }
  if (l) {
    styles.paddingLeft = spacings[l];
  }
  if (r) {
    styles.paddingRight = spacings[r];
  }

  return <View style={[styles, style]} {...props}>
    {children}
  </View>
}

export default Spacer;
