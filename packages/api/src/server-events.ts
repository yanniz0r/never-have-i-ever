import { IPlayer } from ".";

/**
 * Events sent by the server
 */
export enum ServerEvents {
  KickPlayer = 'kick-player',
  ReceiveChatMessage = 'receive-chat-message'
}

export interface KickPlayerServerEvent {
  player: IPlayer;
}

export interface ReceiveChatMessageServerEvent {
  player: IPlayer;
  message: string;
}

