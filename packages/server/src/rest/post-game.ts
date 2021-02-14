import { RestPostGameData } from '@nhie/api';
import * as zod from 'zod';
import games from '../data/games';
import generateGameId from '../generate-game-id';
import Game from '../models/game';
import { Request, Response } from 'express';

const bodySchema = zod.object({
  maxPlayers: zod.number().max(64).min(1),
  maxTime: zod.number().max(60).min(10),
  public: zod.boolean()
});

const postGame = (request: Request, response: Response) => {
  const payload = bodySchema.parse(request.body);
  let id: string;
  do {
    id = generateGameId();
  } while (Object.keys(games).includes(id))
  const game = new Game(id, payload.public, payload.maxTime);
  game.maxPlayers = payload.maxPlayers;
  games[game.id] = game;
  response.send({
    gameId: game.id,
  });
};

export default postGame;
