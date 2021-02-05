export enum Events {
  Join = 'join',
  Enter = 'enter',
  PlayerJoined = 'player-joined',
  PlayerLeft = 'player-left',
  ShowQuestion = 'show-question',
  Answer = 'answer',
  PlayerAnswered = 'player-answered',
  SendChatMessage = 'send-chat-message',
  ReceiveChatMessage = 'receive-chat-message',
  PhaseChange = 'phase-change',
  Continue = 'continue',
  StartCountdown = 'start-countdown'
}

export enum Phase {
  Answer = 'answer',
  RevealAnswers = 'reveal-answer',
}

export interface IQuestion {
  text: string;
}

export interface StartCountdownEvent {
  endDate: string;
}

export interface PhaseChangeEvent {
  phase: Phase;
  answers: Record<string, boolean>;
}

export interface ReceiveChatMessageEvent {
  playerId: string;
  message: string;
}

export interface SendChatMessageEvent {
  message: string;
}

export interface PlayerAnsweredEvent {
  player: IPlayer;
}

export interface ShowQuestionEvent {
  question: IQuestion;
}

export interface EnterGameEvent {
  game: string;
}

export type EnterGameAck = (success: boolean) => void

export interface IPlayer {
  name: string;
  id: string;
}

export interface JoinEvent {
  name: string;
}

export type JoinAck = (id: string) => void

export interface AnswerEvent {
  answer: boolean;
}

export interface PlayerJoinedEvent {
  players: IPlayer[];
  joinedPlayer: IPlayer;
}

export interface PlayerLeftEvent {
  players: IPlayer[];
  leftPlayer: IPlayer;
}

export interface RestGetGameData {
  players: IPlayer[];
  question: IQuestion;
  phase: Phase;
}
