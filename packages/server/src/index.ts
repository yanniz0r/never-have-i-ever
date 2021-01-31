import express from 'express';
import http from 'http';
import * as API from '@nhie/api/dist/index';
import { Server, Socket } from 'socket.io';
import Game from './models/game'
import Player from './models/player';
import cors from 'cors';

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const games: Record<string, Game> = {}

app.use(cors({
  origin: '*',
}))

app.post('/game', (_request, response) => {
  const game = new Game();
  games[game.id] = game;
  response.send({
    gameId: game.id,
  });
});

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
      ack?.(false);
    }
  })

  socket.on('disconnect', () => {
    if (player) {
      game.players = game.players.filter(p => p !== player);
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

  socket.on(API.Events.Answer, (event: API.AnswerEvent) => {
    if (!player) {
      return
    }
    game.answer(player, event.answer);
    if (game.everyoneAnswered()) {
      game.resetAnswers();
      const showQuestionEvent: API.ShowQuestionEvent = {
        question: game.pickQuestion()
      }
      io.to(game.id).emit(API.Events.ShowQuestion, showQuestionEvent)
    }
    const playerAnsweredEvent: API.PlayerAnsweredEvent = {
      playerAnswers: game.allAnswers()
    }
    io.to(game.id).emit(API.Events.PlayerAnswered, playerAnsweredEvent);
  })
})


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
