import { Events } from "@nhie/api";
import React, { FC } from "react";
import { Button, Text, View } from "react-native";
import Spacer from "./spacer";

interface GamePhaseRevealAnswersProps {
  io: SocketIOClient.Socket
}

const GamePhaseRevealAnswers: FC<GamePhaseRevealAnswersProps> = ({ io }) => {
  return <View>
      <Spacer x="l" y="xl">
        <Button title="Weiter" onPress={() => {
          io.emit(Events.Continue);
        }} />
      </Spacer>
      <Text>Reveal Answers</Text>
    </View>
}

export default GamePhaseRevealAnswers
