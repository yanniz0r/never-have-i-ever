import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

const Divider: FC = () => <View style={styles.divider} />

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.125)'
  }
})

export default Divider;
