export enum Events {
  SetUserData = 'set-user-data',
  PlayerJoined = 'player-joined',
  ShowQuestion = 'show-question',
  Drink = 'drink',
  Skip = 'skip'
}

export interface ShowQuestionEvent {
  question: string;
}

export interface IPlayer {
  name: string;
}

export interface SetUserDataEvent {
  name: string;
}

export interface PlayerJoinedEvent {
  players: IPlayer[];
}

