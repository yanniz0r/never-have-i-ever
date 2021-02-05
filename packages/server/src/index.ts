import express from 'express';
import http from 'http';
import * as API from '@nhie/api';
import { Server, Socket } from 'socket.io';
import Game from './models/game'
import Player from './models/player';
import cors from 'cors';
import questions from './data/questions';
import { debug } from './logger';
import generateGameId from './generate-game-id';
import dayjs from 'dayjs';

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const games: Record<string, Game> = {}

const MAX_ROUND_TIME = 15 * 1000;

app.use(cors({
  origin: '*',
}))

app.post('/game', (_request, response) => {
  let id: string;
  do {
    id = generateGameId();
  } while (Object.keys(games).includes(id))
  const game = new Game(id);
  games[game.id] = game;
  response.send({
    gameId: game.id,
  });
});

app.get('/question/random', (_request, response) => {
  response.send(questions[Math.floor(Math.random() * questions.length)]);
})

app.get('/game/:gameId', (request, response) => {
  const gameId = request.params['gameId']
  const game = games[gameId]
  if (!game) {
    response.status(404).send();
    return;
  }
  const payload: API.RestGetGameData = {
    question: game.currentQuestion,
    players: game.players,
    phase: game.phase,
  }
  response.send(payload)
})

io.on('connection', (socket: Socket) => {

  let player: Player;
  let game: Game;

  socket.on(API.Events.Enter, (event: API.EnterGameEvent, ack?: API.EnterGameAck) => {
    const existingGame = games[event.game];
    if (existingGame) {
      game = existingGame;
      socket.join(existingGame.id);
      const showQuestionEvent: API.ShowQuestionEvent = {
        question: game.currentQuestion
      }
      socket.emit(API.Events.ShowQuestion, showQuestionEvent);
      ack?.(true);
    } else {
      debug(`Game with id ${event.game} does not exist`)
      ack?.(false);
    }
  })

  socket.on('disconnect', () => {
    if (player) {
      debug(`Player ${player.id} left the game`, { game })
      game.players = game.players.filter(p => p !== player);
      const playerLeftEvent: API.PlayerLeftEvent = {
        leftPlayer: player,
        players: game.players,
      }
      io.to(game.id).emit(API.Events.PlayerLeft, playerLeftEvent)
      if (game.everyoneAnswered()) {
        game.phase = API.Phase.RevealAnswers
        const phaseChangeEvent: API.PhaseChangeEvent = {
          answers: game.allAnswers(),
          phase: game.phase,
        }
        io.emit(API.Events.PhaseChange, phaseChangeEvent);
      }
    }
  })

  socket.on(API.Events.SendChatMessage, (event: API.SendChatMessageEvent) => {
    const receiveChatMessageEvent: API.ReceiveChatMessageEvent = {
      message: event.message,
      playerId: player.id,
    }
    io.to(game.id).emit(API.Events.ReceiveChatMessage, receiveChatMessageEvent);
  })

  socket.on(API.Events.Join, (event: API.JoinEvent, ack: API.JoinAck) => {
    player = new Player(event.name);
    game.players.push(player);
    const playerJoinedEvent: API.PlayerJoinedEvent = {
      players: game.players,
      joinedPlayer: player,
    }
    io.to(game.id).emit(API.Events.PlayerJoined, playerJoinedEvent)
    ack(player.id)
  })

  socket.on(API.Events.Continue, () => {
    if (game.phase === API.Phase.RevealAnswers) {
      game.phase = API.Phase.Answer;
      game.resetAnswers();
      io.to(game.id).emit(API.Events.ShowQuestion, {
        question: game.pickQuestion(),
      } as API.ShowQuestionEvent)
      const phaseChangeEvent: API.PhaseChangeEvent = {
        phase: game.phase,
        answers: game.allAnswers(),
      }
      io.to(game.id).emit(API.Events.PhaseChange, phaseChangeEvent);
      const startCountdownEvent: API.StartCountdownEvent = {
        endDate: dayjs().add(MAX_ROUND_TIME, 'milliseconds').toDate().toISOString()
      }
      game.timeoutId = setTimeout(() => {
        game.phase = API.Phase.RevealAnswers;
        debug('Timeout over', { game })
        const phaseChangeEvent: API.PhaseChangeEvent = {
          answers: game.allAnswers(),
          phase: game.phase,
        }
        io.to(game.id).emit(API.Events.PhaseChange, phaseChangeEvent);
      }, MAX_ROUND_TIME)
      io.to(game.id).emit(API.Events.StartCountdown, startCountdownEvent)
    }
  })

  socket.on(API.Events.Answer, (event: API.AnswerEvent) => {
    if (!player) {
      return
    }
    game.answer(player, event.answer);
    const playerAnsweredEvent: API.PlayerAnsweredEvent = {
      player,
    }
    io.to(game.id).emit(API.Events.PlayerAnswered, playerAnsweredEvent);
    if (game.everyoneAnswered()) {
      game.clearTimeout();
      game.phase = API.Phase.RevealAnswers
      const phaseChangeEvent: API.PhaseChangeEvent = {
        answers: game.allAnswers(),
        phase: game.phase,
      }
      io.emit(API.Events.PhaseChange, phaseChangeEvent);
    }
  })
})


server.listen(PORT, () => {
  debug(`Server listening on port ${PORT}`)
})
