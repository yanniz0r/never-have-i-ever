import * as API from '@nhie/api';
import { Logger } from 'tslog';
import PlayerSession from '../models/session';
import SocketController from '../socket-controller';

const logger = new Logger({ name: "kick-player-event" });

const kickPlayerEvent = (controller: SocketController, session: PlayerSession) => (event: API.KickPlayerEvent) => {
  if (!session.game) {
    logger.debug("Can not kick player when game is not set")
    return;
  }
  if (session.player !== session.game.host) {
    logger.error("Only the host can kick players")
    return;
  }
  for (const player of session.game.players) {
    if (player.id === event.playerId) {
      controller.kick(session.game, {
        player: player
      });
      setTimeout(() => {
        if (player.socket.connected) {
          player.socket.disconnect();
        }
      }, 1000);
      break;
    }
  }
  logger.debug("Player kicked", session.game.id, event.playerId)
}

export default kickPlayerEvent;
