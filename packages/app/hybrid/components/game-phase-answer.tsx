import { AnswerEvent, Events, IQuestion } from "@nhie/api";
import React, { FC, useCallback, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Spacer from "./spacer";
import Typography from "./typography";

interface GamePhaseAnswerProps {
  io: SocketIOClient.Socket;
  question?: IQuestion;
}

const GamePhaseAnswer: FC<GamePhaseAnswerProps> = ({ io, question }) => {
  const [hasAnswered, setHasAnswered] = useState(false);
  const onCorrectPress = useCallback(() => {
    const answerEvent: AnswerEvent = {
      answer: true
    }
    io.emit(Events.Answer, answerEvent)
    setHasAnswered(true);
  }, [io])

  const onIncorrectPress = useCallback(() => {
    const answerEvent: AnswerEvent = {
      answer: false
    }
    io.emit(Events.Answer, answerEvent)
    setHasAnswered(true);
  }, [io])

  return <View style={styles.container}>
    <View>
      <Spacer x="l" y="l">
        <Typography center type="headline">{question?.text}</Typography>
      </Spacer>
    </View>
    <View style={styles.answerButtons}>
      {hasAnswered &&
        <View style={styles.alreadyAnsweredContainer}>
          <Typography type="body">Du hast bereits geantwortet</Typography>
        </View>
      }
      <Spacer y="l" x="l" style={styles.answerButton}>
        <Button onPress={onCorrectPress} title="Schuldig" />
      </Spacer>
      <Spacer y="l" x="l" style={styles.answerButton}>
        <Button onPress={onIncorrectPress} title="Unschuldig" />
      </Spacer>
    </View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    textAlign: 'center'
  },
  answerButtons: {
    backgroundColor: 'rgba(255,255,255,0.125)',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  answerButton: {
    width: '50%',
    flexGrow: 1,
    zIndex: 10,
  },
  alreadyAnsweredContainer: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    position: 'absolute',
    backgroundColor: 'rgba(139,92,246,0.95)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default GamePhaseAnswer
