import express from 'express';
import http from 'http';
import * as API from '@nhie/api';
import { Server, Socket } from 'socket.io';
import Game from './models/game'
import Player from './models/player';
import cors from 'cors';
import questions from './data/questions';
import dayjs from 'dayjs';
import {json} from 'body-parser';
import games from './data/games';
import postGame from './rest/post-game';
import { Logger } from 'tslog';
import PlayerSession from './models/session';
import kickPlayerEvent from './socket/kick-player-event';
import SocketController from './socket-controller';
import sendChatMessageHandler from './socket/send-chat-message-handler';

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors({
  origin: '*',
}));

app.use(json());

app.get('/games', (_request, response) => {
  const data: API.RestGetGamesData = Object.values(games).filter(game => game.isPublic).map(game => ({
    id: game.id,
    maxTime: game.maxTime,
    currentQuestion: game.currentQuestion,
    players: game.players.length,
  }));
  response.send(data);
})

app.post('/game', postGame);

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
    host: game.host,
  }
  response.send(payload)
})

const logger = new Logger();

io.on('connection', (socket: Socket) => {

  const controller = new SocketController(io);
  const session = new PlayerSession(io);

  // let player: Player;
  // let game: Game;

  socket.on(API.Events.Enter, (event: API.EnterGameEvent, ack?: API.EnterGameAck) => {
    const existingGame = games[event.game];
    if (existingGame) {
      if (existingGame.isFull) {
        logger.debug('Game is full', existingGame.id)
        ack?.('full');
        return;
      }
      session.game = existingGame;
      socket.join(existingGame.id);
      const showQuestionEvent: API.ShowQuestionEvent = {
        question: session.game.currentQuestion
      }
      logger.debug('Player entered the game', session.game.id);
      socket.to(session.game.id).emit(API.Events.ShowQuestion, showQuestionEvent);
      ack?.('success');
    } else {
      logger.debug('Game does not exist', event.game);
      ack?.('not-found');
    }
  })

  socket.on('disconnect', () => {
    if (session.player && session.game) {
      logger.debug('Player left', session.game.id, session.player.id);
      const playerWasHost = session.player === session.game.host;
      session.game.players = session.game.players.filter(p => p !== session.player);
      const playerLeftEvent: API.PlayerLeftEvent = {
        leftPlayer: session.player,
        players: session.game.players,
      }
      io.to(session.game.id).emit(API.Events.PlayerLeft, playerLeftEvent)
      if (playerWasHost && session.game.host) {
        const hostChangeEvent: API.HostChangeEvent = {
          host: session.game.host
        }
        io.to(session.game.id).emit(API.Events.HostChange, hostChangeEvent);
      }
      if (session.game.everyoneAnswered()) {
        session.game.phase = API.Phase.RevealAnswers
        const phaseChangeEvent: API.PhaseChangeEvent = {
          answers: session.game.allAnswers(),
          phase: session.game.phase,
        }
        io.emit(API.Events.PhaseChange, phaseChangeEvent);
      }
    }
  })

  socket.on(API.Events.KickPlayer, kickPlayerEvent(controller, session));
  socket.on(API.ClientEvents.SendChatMessage, sendChatMessageHandler(controller, session));

  socket.on(API.Events.Join, (event: API.JoinEvent, ack: API.JoinAck) => {
    if (!session.game) {
      logger.error('User tried to join without having entered a game', event);
      return;
    }
    session.player = new Player(socket, event.name);
    session.game.players.push(session.player);
    const playerJoinedEvent: API.PlayerJoinedEvent = {
      players: session.game.players,
      joinedPlayer: session.player,
    }
    io.to(session.game.id).emit(API.Events.PlayerJoined, playerJoinedEvent)
    if (session.player === session.game.host) {
      const hostChangeEvent: API.HostChangeEvent = {
        host: session.game.host,
      };
      io.to(session.game.id).emit(API.Events.HostChange, hostChangeEvent);
    }
    ack(session.player.id)
  })

  socket.on(API.Events.Continue, () => {
    if (!session.player || !session.game) {
      logger.error('Either player or game are not defined');
      return;
    }
    if (session.player !== session.game.host) {
      logger.error('Only the host can continue the game');
      return;
    }
    if (session.game.phase === API.Phase.RevealAnswers) {
      session.game.phase = API.Phase.Answer;
      session.game.resetAnswers();
      io.to(session.game.id).emit(API.Events.ShowQuestion, {
        question: session.game.pickQuestion(),
      } as API.ShowQuestionEvent)
      const phaseChangeEvent: API.PhaseChangeEvent = {
        phase: session.game.phase,
        answers: session.game.allAnswers(),
      }
      io.to(session.game.id).emit(API.Events.PhaseChange, phaseChangeEvent);
      const startCountdownEvent: API.StartCountdownEvent = {
        endDate: dayjs().add(session.game.maxTime * 1000, 'milliseconds').toDate().toISOString()
      }
      session.game.timeoutId = setTimeout(() => {
        if (!session.game) {
          logger.error('Session lacks game')
          return;
        }
        session.game.phase = API.Phase.RevealAnswers;
        const phaseChangeEvent: API.PhaseChangeEvent = {
          answers: session.game.allAnswers(),
          phase: session.game.phase,
        }
        io.to(session.game.id).emit(API.Events.PhaseChange, phaseChangeEvent);
      }, session.game.maxTime * 1000)
      io.to(session.game.id).emit(API.Events.StartCountdown, startCountdownEvent)
    }
  })

  socket.on(API.Events.Answer, (event: API.AnswerEvent) => {
    if (!session.player || !session.game) {
      logger.error('Players can only answer once joined and entered the game');
      return
    }
    session.game.answer(session.player, event.answer);
    const playerAnsweredEvent: API.PlayerAnsweredEvent = {
      player: session.player,
    }
    io.to(session.game.id).emit(API.Events.PlayerAnswered, playerAnsweredEvent);
    if (session.game.everyoneAnswered()) {
      session.game.clearTimeout();
      session.game.phase = API.Phase.RevealAnswers
      const phaseChangeEvent: API.PhaseChangeEvent = {
        answers: session.game.allAnswers(),
        phase: session.game.phase,
      }
      io.emit(API.Events.PhaseChange, phaseChangeEvent);
    }
  })
})


server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`)
})
