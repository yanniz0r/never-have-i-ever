import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacityProps, TouchableOpacity } from "react-native";
import Spacer from "./spacer";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const Button: FC<ButtonProps> = ({title, style, ...props}) => {
  return <TouchableOpacity style={[styles.button, style]} {...props}>
    <Spacer x="l" y="l">
      <Text style={styles.buttonText}>{title}</Text>
    </Spacer>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: 'rgb(237,233,254)'
  },
  button: {
    borderRadius: 8,
    backgroundColor: 'rgba(139,92,246,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Button;
