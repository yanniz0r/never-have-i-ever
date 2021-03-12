import { ParamListBase } from "@react-navigation/routers";

export default interface RouteParameters extends ParamListBase {
  Game: {
    gameId: string
  },
  CreateGame: {}
}
