import PlayerSession from "../models/session";
import SocketController from "../socket-controller";
import * as API from "@nhie/api";
import { Logger } from "tslog";

const logger = new Logger({ name: 'sSendChatMessage' });

const sendChatMessageHandler = (controller: SocketController, session: PlayerSession) => (event: API.SendChatMessageClientEvent) => {
  if (!session.player) {
    logger.error('User without session tried to send message', event);
    return;
  }
  if (!session.game) {
    logger.error('User tried to send message without being in a game', event);
    return
  }
  logger.debug('Player sent message', session.player.id, event);
  controller.receiveChatMessage(session.game, {
    message: event.message,
    player: session.player,
  });
}

export default sendChatMessageHandler;
