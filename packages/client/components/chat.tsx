import { IPlayer } from '@nhie/api/dist'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      player: {
        id: "123",
        name: "Fabian die Sau"
      },
      text: "Was ist das für 1 Frage hier gerade"
    }
  ]);

  useEffect(() => {
    const receiveChatMessage = (event: API.ReceiveChatMessageEvent) => {
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
    }
    io.on(API.Events.ReceiveChatMessage, receiveChatMessage)
    return () => io.removeEventListener(API.Events.ReceiveChatMessage, receiveChatMessage)
  }, [players, messages])

  const sendMessage = useCallback(() => {
    const sendChatMessageEvent: API.SendChatMessageEvent = {
      message,
    }
    io.emit(API.Events.SendChatMessage, sendChatMessageEvent)
    setMessage("")
  }, [io, message, setMessage])

  return <div className="bg-gray-800 w-full flex flex-col" style={{ height: '30vh' }}>
      <div className="p-10 flex-grow overflow-y-scroll" ref={messageContainerRef} >
        {messages.map((message, index) => (
          <div key={index} className="flex">
            <div className="mr-2">
              <strong className={'rounded-sm ' + twBackgroundClassForColor(colorForString(message.player.name))}>{message.player.name}</strong>
            </div>
            <div className="">
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Nachricht eingeben..." className="p-2 pl-10 bg-transparent flex-grow bg-gray-700 " />
        <button className="px-5 bg-purple-500 font-bold" onClick={sendMessage}>Senden</button>
      </div>
    </div>
}

export default Chat;
