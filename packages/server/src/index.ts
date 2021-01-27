import express from 'express';
import http from 'http';
import * as API from '@nhie/api/dist/index';
import { Server, Socket } from 'socket.io';

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

class Player implements API.IPlayer {
  constructor(public name: string) {}
}

class Game {
  public players: Player[] = []
}

const game = new Game()

io.on('connection', (socket: Socket) => {
  // console.log(socket.rooms);
  socket.on(API.Events.SetUserData, (event:API.SetUserDataEvent) => {
    const player = new Player(event.name);
    game.players.push(player);
    console.log(game.players);
    const playerJoinedEvent: API.PlayerJoinedEvent = {
      players: game.players
    }
    io.emit(API.Events.PlayerJoined, playerJoinedEvent)
    const showQuestionEvent: API.ShowQuestionEvent = {
      question: 'pommes vom Boden gegessen'
    }
    io.emit(API.Events.ShowQuestion, showQuestionEvent)
  })
})


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})