import React, { FC } from "react";
import { Text, TextProps } from "react-native";

type TypographyType = 'body' | 'headline' | 'subheadline' | 'caption' | 'hint'

const fontSizes: Record<TypographyType, number> = {
  caption: 18,
  body: 16,
  hint: 12,
  headline: 32,
  subheadline: 26
}

const colors: Record<TypographyType, string> = {
  headline: 'white',
  caption: 'rgba(255,255,255,0.95)',
  body: 'rgba(255,255,255,0.85)',
  subheadline: '#ffffff',
  hint: 'rgba(255,255,255,0.5)'
}

interface TypographyProps extends TextProps {
  type: TypographyType;
  center?: boolean;
}

const Typography: FC<TypographyProps> = ({ type, center, ...props}) => {
  const fontSize = fontSizes[type];
  const color = colors[type];
  return <Text style={{ fontSize, color, textAlign: center ? 'center' : 'left' }} {...props} />
}

export default Typography;

