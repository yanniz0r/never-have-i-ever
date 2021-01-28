export declare enum Events {
    Join = "join",
    Enter = "enter",
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
export interface EnterGameEvent {
    game: string;
}
export declare type EnterGameAck = (success: boolean) => void;
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
