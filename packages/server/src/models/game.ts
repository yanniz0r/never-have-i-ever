import { v4 } from "uuid";
import questions from "../data/questions";
import Player from "./player";
import Question from "./question";
import * as API from "@nhie/api";

export default class Game {
  public players: Player[] = [];
  public remainingQuestions: Question[] = [...questions];
  public currentQuestion!: Question;
  public phase = API.Phase.Answer;

  private answers: Map<Player, boolean> = new Map();

  constructor(public id: string = v4()) {
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
