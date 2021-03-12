import { RouteProp } from "@react-navigation/core";
import React, { FC } from "react";
import { Text, View } from "react-native";
import RouteParameters from "../route-parameters";

interface GameScreenProps {
  route: RouteProp<RouteParameters, 'Game'>;
}

const GameScreen: FC<GameScreenProps> = (props) => {
  const {gameId} = props.route.params;
  return <View>
    <Text>{gameId}</Text>
  </View>
}

export default GameScreen;
