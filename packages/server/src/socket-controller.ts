import { Server } from "socket.io";
import * as API from '@nhie/api';
import Game from "./models/game";

class SocketController {
  constructor(private io: Server) {}

  public kick(game: Game, event: API.KickPlayerServerEvent) {
    this.io.to(game.id).emit(API.ServerEvents.KickPlayer, event);
  }

  public receiveChatMessage(game: Game, event: API.ReceiveChatMessageServerEvent) {
    this.io.to(game.id).emit(API.ServerEvents.ReceiveChatMessage, event);
  }

}

export default SocketController;
