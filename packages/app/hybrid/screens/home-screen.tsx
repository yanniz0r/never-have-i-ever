import { NavigationProp, useNavigation } from "@react-navigation/core"
import React, { FC, useCallback, useState } from "react"
import { Button, StyleSheet, TextInput, View } from "react-native"
import RouteParameters from "../route-parameters"

interface HomeScreenProps {
  navigation: NavigationProp<RouteParameters, 'Home'>
}

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const [joinGameId, setJoinGameId] = useState('')

  const onCreateGameButtonPress = useCallback(() => {
    navigation.navigate("CreateGame", {})
  }, [navigation])

  const onJoinGameButtonPress = useCallback(() => {
    navigation.navigate("Game", { gameId: joinGameId })
  }, [navigation, joinGameId])

  return <View style={styles.container}>
    <View style={styles.gameOption}>
      <Button onPress={onCreateGameButtonPress} title="Spiel erstellen" />
    </View>
    <View style={styles.gameOption}>
      <View>
        <TextInput style={styles.joinGameInput} onChange={e => setJoinGameId(e.nativeEvent.text)} />
        <Button onPress={onJoinGameButtonPress} title="Beitreten" />
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
