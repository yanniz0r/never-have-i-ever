import { IPlayer } from '@nhie/api/dist'
import React, { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import * as API from '@nhie/api/dist'
import { colorForString, twBackgroundClassForColor } from '../util/color-utils';

interface ChatProps {
  io: SocketIOClient.Socket;
  players: IPlayer[];
}

interface ChatMessage {
  player: IPlayer;
  text: string;
}

const Chat: FC<ChatProps> = ({ io, players }) => {
  const [message, setMessage] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement>();
  const [messages, setMessages] = useState<Array<ChatMessage | string>>([]);

  useEffect(() => {
    io.on(API.Events.ReceiveChatMessage, (event: API.ReceiveChatMessageEvent) => {
      const player = players.find(p => p.id === event.playerId);
      if (!player) {
        console.log(players)
        console.warn(`Player with ID ${event.playerId} is not currently connected to the game.`)
        return;
      }
      setMessages([
        ...messages,
        {
          text: event.message,
          player,
        },
      ]);
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
    io.on(API.Events.PlayerJoined, (event: API.PlayerJoinedEvent) => {
      setMessages([
        ...messages,
        `${event.joinedPlayer.name} ist dem Spiel beigetreten`
      ])
    });
    io.on(API.Events.PlayerAnswered, (event: API.PlayerAnsweredEvent) => {
      setMessages([
        ...messages,
        `${event.player.name} hat geantwortet`
      ])
    });
  }, [players, messages])

  const sendMessage = useCallback((event: FormEvent) => {
    event.preventDefault();
    const sendChatMessageEvent: API.SendChatMessageEvent = {
      message,
    }
    io.emit(API.Events.SendChatMessage, sendChatMessageEvent)
    setMessage("")
  }, [io, message, setMessage])

  return <div className="bg-gray-800 w-full relative h-full">
      <div className="p-10 h-full overflow-y-scroll" ref={messageContainerRef} >
        {messages.map((message, index) => typeof message === 'string'
          ? <div className="text-gray-500 text-center font-italic text-xs">{message}</div>
          : <div key={index} className="flex text-white">
            <div className="mr-2">
              <strong className={'rounded-sm px-1 ' + twBackgroundClassForColor(colorForString(message.player.id))}>{message.player.name}</strong>
            </div>
            <div className="text-white">
              {message.text}
            </div>
          </div>
        )}
      </div>
      <div className="absolute p-10 bottom-0 w-full">
        <form className="flex shadow-lg overflow-hidden rounded-lg" onSubmit={sendMessage}>
          <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Nachricht eingeben..." className="p-2 px-4 text-white bg-transparent flex-grow bg-gray-700 " />
          <button type="submit" name="message" className="px-5 bg-purple-500 font-bold text-white">Senden</button>
        </form>
      </div>
    </div>
}

export default Chat;
