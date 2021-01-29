import express from 'express';
import http from 'http';
import * as API from '@nhie/api/dist/index';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid'

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

class Player implements API.IPlayer {
  public id = v4()
  constructor(public name: string) {}
}

class Question implements API.IQuestion {

  constructor(public text: string) {}

}

// class ChatMessage {
//   constructor(public player: Player, public message: string){}
// }

const questions = [
  new Question('pommes vom Boden gegessen'),
  new Question('etwas geklaut'),
  new Question('bei Twitch gestreamt'),
  new Question('jemandem meine Lebensgeschichte erzählt und dabei festgestellt, dass ich ähnlich wie die empfangene Person bin'),
]

class Game {
  public players: Player[] = [];
  public remainingQuestions: Question[] = [...questions];
  public currentQuestion!: Question
  private answers: Map<Player, boolean> = new Map();

  constructor(public id: string) {
    this.pickQuestion();
  }

  public answer(player: Player, answer: boolean) {
    this.answers.set(player, answer);
  }

  public allAnswers(): Record<string, boolean> {
    const answers: Record<string, boolean> = {};
    this.answers.forEach((value, player) => {
      answers[player.id] = value;
    })
    return answers;
  }

  public resetAnswers() {
    this.answers.clear()
  }

  public everyoneAnswered() {
    return this.players.length === this.answers.size; 
  }

  public pickQuestion() {
    const questionIndex = Math.floor(Math.random() * this.remainingQuestions.length);
    this.currentQuestion = this.remainingQuestions[questionIndex];
    this.remainingQuestions = this.remainingQuestions.filter((_, i )=> i !== questionIndex)
    if (!this.remainingQuestions.length) {
      this.remainingQuestions = [...questions];
    }
    return this.currentQuestion;
  }
}

const games: Record<string, Game> = {
  "1": new Game("1"),
  "2": new Game("2")
}

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
      players: game.players
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