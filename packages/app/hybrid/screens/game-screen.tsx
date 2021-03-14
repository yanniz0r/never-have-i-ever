import { RouteProp } from "@react-navigation/core";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import RouteParameters from "../route-parameters";
import socketio from 'socket.io-client'
import { BACKEND_URL } from "../constants/networking";
import { EnterGameEvent, Events, IQuestion, AnswerEvent, Phase, PhaseChangeEvent, JoinEvent, ShowQuestionEvent, PlayerJoinedEvent, PlayerLeftEvent, IPlayer,  } from "@nhie/api";
import useGameQuery from '../hooks/use-game-query';
import Spacer from "../components/spacer";
import Input, { Label } from "../components/input";
import useSocketHandler from "../hooks/use-socket-handler";
import GamePhaseAnswer from "../components/game-phase-answer";
import GamePhaseRevealAnswers from "../components/game-phase-reveal-answers";

interface GameScreenProps {
  route: RouteProp<RouteParameters, 'Game'>;
}

const GameScreen: FC<GameScreenProps> = (props) => {
  const {gameId} = props.route.params;
  const gameQuery = useGameQuery(gameId);
  const [phase, setPhase] = useState<Phase>()
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [username, setUsername] = useState('')
  const [question, setQuestion] = useState<IQuestion>()
  const [isLoggedIn, setLoggedIn] = useState(false)
  const io = useMemo(() => {
    const socket = socketio(BACKEND_URL)
    const enterGameEvent: EnterGameEvent = {
      game: gameId
    }
    socket.emit(Events.Enter, enterGameEvent, console.log)
    return socket;
  }, [gameId])

  useSocketHandler<PlayerJoinedEvent>(io, Events.PlayerJoined, (event) => {
    setPlayers(event.players);
  })

  useSocketHandler<PhaseChangeEvent>(io, Events.PhaseChange, (event) => {
    setAnswers(event.answers)
    setPhase(event.phase)
  })

  useSocketHandler<ShowQuestionEvent>(io, Events.ShowQuestion, (event) => {
    setQuestion(event.question)
  })

  useEffect(() => {
    if (gameQuery.isSuccess) {
      setPhase(gameQuery.data.phase)
      setQuestion(gameQuery.data.question)
    }
  }, [gameQuery.data])

  const onJoin = useCallback(() => {
    const joinEvent: JoinEvent = {
      name: username,
    }
    io.emit(Events.Join, joinEvent, console.log)
    setLoggedIn(true)
  }, [io, username])

  if (!isLoggedIn) {
    return <Spacer x="l">
      <View>
        <Spacer y="m">
          <Label text="Nutzername">
            <Input onChange={(e) => setUsername(e.nativeEvent.text)} />
          </Label>
        </Spacer>
        <Button onPress={onJoin} title="Spiel beitreten" />
      </View>
    </Spacer>
  }

  return <View>
    <Spacer x="l">
    </Spacer>
    {phase === Phase.Answer && <GamePhaseAnswer io={io} question={question} />}
    {phase === Phase.RevealAnswers && <GamePhaseRevealAnswers
      answers={answers}
      players={players}
      io={io}
    />}
  </View>
}


export default GameScreen;
