import React, { FC, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Spacer from "./spacer";

interface StepInputProps {
  min?: number;
  max?: number;
  value: number;
  onChange(value: number): void;
}

const StepInput: FC<StepInputProps> = ({ value, min, max, onChange }) => {
  const onIncrement = useCallback(() => {
    onChange(value + 1)
  }, [value, onChange])

  const onDecrement = useCallback(() => {
    onChange(value - 1)
  }, [value, onChange])

  return <View style={styles.container}>
    <TouchableOpacity onPress={onDecrement} style={styles.stepper} disabled={!!min && value <= min}>
      <Text style={styles.stepperText}>-</Text>
    </TouchableOpacity>
    <Spacer x="xl">
      <Text style={styles.number}>{value}</Text>
    </Spacer>
    <TouchableOpacity onPress={onIncrement} style={styles.stepper} disabled={!!max && value >= max}>
      <Text style={styles.stepperText}>+</Text>
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  number: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 32,
  },
  stepperText: {
    color: 'white',
    fontWeight: 'bold'
  },
  stepper: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(139,92,246)'
  }
})

export default StepInput;
