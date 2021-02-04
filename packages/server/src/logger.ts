import Game from "./models/game";

export const debug = (message: string, data?: { game: Game }) => {
  console.log(`[DEBUG]${data?.game && `[game:${data.game.id}]`} ${message}`)
}
