import { Server } from "socket.io";
import Game from "./game";
import Player from "./player";

export default class PlayerSession {
  public game?: Game;
  public player?: Player;
  constructor(public io: Server) {}
}
