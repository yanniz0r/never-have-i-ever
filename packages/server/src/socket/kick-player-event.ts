import * as API from '@nhie/api';
import { Logger } from 'tslog';
import PlayerSession from '../models/session';

const logger = new Logger({ name: "kick-player-event" });

const kickPlayerEvent = (session: PlayerSession) => (event: API.KickPlayerEvent) => {
  if (!session.game) {
    logger.debug("Can not kick player when game is not set")
    return;
  }
  if (session.player !== session.game.host) {
    logger.error("Only the host can kick players")
    return;
  }
  session.game.players.forEach(player => {
    if (player.id === event.playerId) {
      player.socket.disconnect();
    }
  })
  logger.debug("Player kicked", session.game.id, event.playerId)
}

export default kickPlayerEvent;
