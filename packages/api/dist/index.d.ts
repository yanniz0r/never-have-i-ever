export declare enum Events {
    SetUserData = "set-user-data",
    PlayerJoined = "player-joined",
    ShowQuestion = "show-question",
    Answer = "answer",
    PlayerAnswered = "player-answered"
}
export interface IQuestion {
    text: string;
}
export interface PlayerAnsweredEvent {
    playerAnswers: Record<string, boolean>;
}
export interface ShowQuestionEvent {
    question: IQuestion;
}
export interface IPlayer {
    name: string;
    id: string;
}
export interface SetUserDataEvent {
    name: string;
}
export interface AnswerEvent {
    answer: boolean;
}
export interface PlayerJoinedEvent {
    players: IPlayer[];
}
