/**
 * Events sent by the client
 */
export enum ClientEvents {
  SendChatMessage = 'send-chatmessage'
}

export interface SendChatMessageClientEvent {
  message: string;
}
