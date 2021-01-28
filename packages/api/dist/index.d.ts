export declare enum Events {
    Join = "join",
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
export interface JoinEvent {
    name: string;
}
export declare type JoinAck = (id: string) => void;
export interface AnswerEvent {
    answer: boolean;
}
export interface PlayerJoinedEvent {
    players: IPlayer[];
}
