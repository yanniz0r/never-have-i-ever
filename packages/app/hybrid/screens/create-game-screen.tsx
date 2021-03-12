import { NavigationProp, RouteProp } from "@react-navigation/core";
import React, { FC, useCallback, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Label } from "../components/input";
import Spacer from "../components/spacer";
import StepInput from "../components/step-input";
import useCreateGameMutation from "../hooks/use-create-game-mutation";
import RouteParameters from "../route-parameters";

interface CreateGameScreenProps {
  route: RouteProp<RouteParameters, 'CreateGame'>,
  navigation: NavigationProp<RouteParameters, 'CreateGame'>
}

const CreateGameScreen: FC<CreateGameScreenProps> = ({ navigation }) => {
  const [maxPlayers, setMaxPlayers] = useState(15);
  const [answerTime, setAnswerTime] = useState(30);
  const createGameMutation = useCreateGameMutation()

  const createGameButtonClick = useCallback(async () => {
    const createPlayerResponse = await createGameMutation.mutateAsync({
      maxTime: answerTime,
      maxPlayers,
      public: true,
    })
    navigation.navigate('Game', createPlayerResponse)
  }, [])

  return <View style={styles.container}>
    <Text style={styles.introText}>Du bist nur noch Sekunden von deinem "Ich habe noch nie..."-Spiel entfernt. Gib uns noch ein paar Details, damit wir wissen wie wir dein Spiel erstellen sollen.</Text>
    <Spacer y="l">
      <Label text="Maximale Spielerzahl">
        <StepInput min={2} max={32} onChange={setMaxPlayers} value={maxPlayers}/>
      </Label>
    </Spacer>
    <Spacer y="l">
      <Label text="Antwortzeit">
        <StepInput min={10} max={60} onChange={setAnswerTime} value={answerTime}/>
      </Label>
    </Spacer>
    <Button onPress={createGameButtonClick} title="Spiel erstellen" />
  </View>
}

const styles = StyleSheet.create({
  introText: {
    fontSize: 20,
    lineHeight: 25,
  },
  container: {
    padding: 16,
  }
})

export default CreateGameScreen;
