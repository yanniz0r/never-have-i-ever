import { AnswerEvent, Events, IQuestion } from "@nhie/api";
import React, { FC, useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Spacer from "./spacer";

interface GamePhaseAnswerProps {
  io: SocketIOClient.Socket;
  question?: IQuestion;
}

const GamePhaseAnswer: FC<GamePhaseAnswerProps> = ({ io, question }) => {
  const onCorrectPress = useCallback(() => {
    const answerEvent: AnswerEvent = {
      answer: true
    }
    io.emit(Events.Answer, answerEvent)
  }, [io])

  const onIncorrectPress = useCallback(() => {
    const answerEvent: AnswerEvent = {
      answer: false
    }
    io.emit(Events.Answer, answerEvent)
  }, [io])

  return <View>
    <Text style={styles.question}>{question?.text}</Text>
    <Spacer y="s">
      <Button onPress={onCorrectPress} title="Stimmt" />
    </Spacer>
    <Spacer y="s">
      <Button onPress={onIncorrectPress} title="Stimmt nicht" />
    </Spacer>
    <Text>Answer</Text>
  </View>
}

const styles = StyleSheet.create({
  question: {
    fontSize: 24,
    textAlign: 'center'
  }
})

export default GamePhaseAnswer
