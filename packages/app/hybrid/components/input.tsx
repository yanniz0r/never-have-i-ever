import React, { FC } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {}

const Input: FC<TextInputProps> = ({style ,...props}) => {
  return <TextInput style={[style, styles.input]} {...props} />
}

interface LabelProps {
  text: string;
}

export const Label: FC<LabelProps> = ({ text, children }) => {
  return <View>
    <Text>{text}</Text>
    {children}
  </View>
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 3,
    borderRadius: 8,
    borderColor: 'rgb(139,92,246)'
  }
})

export default Input;
