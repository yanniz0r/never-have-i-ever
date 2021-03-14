import { Events, IPlayer, PhaseChangeEvent } from "@nhie/api";
import React, { FC, useMemo } from "react";
import { Button, Text, View, FlatList, StyleSheet } from "react-native";
import Divider from "./divider";
import Spacer from "./spacer";
import Typography from "./typography";

interface GamePhaseRevealAnswersProps {
  io: SocketIOClient.Socket,
  answers: Record<string, boolean>;
  players: IPlayer[];
}

const GamePhaseRevealAnswers: FC<GamePhaseRevealAnswersProps> = ({ io, players, answers }) => {
  const header = <View>
    <Spacer x="l" y="xl">
      <Typography type="caption">Das sind die Ergebnisse</Typography>
      <Spacer y="s" b="l">
        <Typography type="body">Bereit für die nächste Runde? Dann drücke auf Weiter uns es geht direkt mit der nächsten Frage weiter!</Typography>
      </Spacer>
      <Button title="Weiter" onPress={() => {
        io.emit(Events.Continue);
      }} />
    </Spacer>
    <Text>Reveal Answers</Text>
  </View>
  return <View>
      <FlatList ItemSeparatorComponent={Divider} ListHeaderComponent={header} data={players} renderItem={(item) => {
        const answer = answers[item.item.id]
        return <Spacer x="l" y="m">
          <View style={styles.row} >
            <Spacer r="m">
              <View style={styles.rowAvatar}>
                <Text>
                  {answer === undefined && '🐰'}
                  {answer === true && '😈'}
                  {answer === false && '😇'}
                </Text>
              </View>
            </Spacer>
            <View style={styles.rowContent}>
              <Typography type="caption" >{item.item.name}</Typography>
              <Typography type="body" >
                {answer === undefined && 'Hat sich nicht getraut zu antworten'}
                {answer === true && 'Ist schuldig'}
                {answer === false && 'Ist unschuldig'}
              </Typography>
            </View>
          </View>
        </Spacer>
      }} />
    </View>
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  rowAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'hotpink'
  },
  rowContent: {

  },
  rowContentHeadline: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  rowContentSubHeadline: {

  }
})

export default GamePhaseRevealAnswers
