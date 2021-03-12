import { useNavigation } from "@react-navigation/core"
import React, { FC, useCallback } from "react"
import { Button, StyleSheet, TextInput, View } from "react-native"

const HomeScreen: FC = () => {
  const navigation = useNavigation();

  const onCreateGameButtonClick = useCallback(() => {
    navigation.navigate("CreateGame")
  }, [navigation])

  return <View style={styles.container}>
    <View style={styles.gameOption}>
      <Button onPress={onCreateGameButtonClick} title="Spiel erstellen" />
    </View>
    <View style={styles.gameOption}>
      <View>
        <TextInput style={styles.joinGameInput} />
        <Button onPress={console.log} title="Beitreten" />
      </View>
    </View>
    <View style={styles.gameOption}>
      <Button onPress={console.log} title="Offline spiele" disabled />
    </View>
  </View>
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    display: 'flex',
    flex: 1,
  },
  joinGameInput: {
    backgroundColor: '#c6c6c6'
  },
  gameOption: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  }
})

export default HomeScreen;
