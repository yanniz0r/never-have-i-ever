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
  StartCountdown = 'start-countdown',
  HostChange = 'host-change',
  KickPlayer = 'kick',
}

export * from './server-events';
export * from './client-events';

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

export interface HostChangeEvent {
  host: IPlayer;
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

export type EnterGameAck = (status: 'success' | 'full' | 'not-found') => void

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
  host?: IPlayer;
}

export type RestGetGamesData = Array<{
  id: string;
  maxTime: number;
  currentQuestion: IQuestion;
  players: number;
}>

export interface RestPostGameData {
  maxTime: number;
  public: boolean;
  maxPlayers: number;
}

export interface KickPlayerEvent {
  playerId: string;
}
