import { IPlayer } from '@nhie/api/dist'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import * as API from '@nhie/api/dist'
import { colorForString, twBackgroundClassForColor } from '../util/color-utils';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface ChatProps {
  io: SocketIOClient.Socket;
  players: IPlayer[];
  host?: IPlayer;
}

interface ChatMessage {
  player: IPlayer;
  text: string;
}

const Chat: FC<ChatProps> = ({ io, players, host }) => {
  const messageContainerRef = useRef<HTMLDivElement>();
  const [messages, setMessages] = useState<Array<ChatMessage | string>>([]);
  const form = useFormik<{ message: string }>({
    initialValues: {
      message: '',
    },
    validationSchema: yup.object().shape({
      message: yup
        .string()
        .trim()
        .required()
    }),
    onSubmit(values) {
      sendMessage(values.message);
      form.resetForm();
    }
  })

  useEffect(() => {
    const receiveChatMessage = (event: API.ReceiveChatMessageEvent) => {
      const player = players.find(p => p.id === event.playerId);
      if (!player) {
        console.warn(`Player with ID ${event.playerId} is not currently connected to the game.`)
        return;
      }
      setMessages(oldMessages => [
        ...oldMessages,
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

    const playerJoined = (event: API.PlayerJoinedEvent) => {
      setMessages((oldMessages) => [
        ...oldMessages,
        `${event.joinedPlayer.name} ist dem Spiel beigetreten`
      ])
    }
    io.on(API.Events.PlayerJoined, playerJoined);

    const playerLeft = (event: API.PlayerLeftEvent) => {
      setMessages((oldMessages) => [
        ...oldMessages,
        `${event.leftPlayer.name} hat das Spiel verlassen`
      ])
    }
    io.on(API.Events.PlayerLeft, playerLeft);

    const playerAnswered = (event: API.PlayerAnsweredEvent) => {
      setMessages((oldMessages) => [
        ...oldMessages,
        `${event.player.name} hat geantwortet`
      ])
    }
    io.on(API.Events.PlayerAnswered, playerAnswered);

    const hostChange = (event: API.HostChangeEvent) => {
      setMessages((oldMessages) => [
        ...oldMessages,
        `${event.host.name} ist jetzt der Host`
      ]);
    }
    io.on(API.Events.HostChange, hostChange);

    return () => {
      io.off(API.Events.ReceiveChatMessage, receiveChatMessage);
      io.off(API.Events.PlayerJoined, playerJoined);
      io.off(API.Events.PlayerLeft, playerLeft);
      io.off(API.Events.PlayerAnswered, playerAnswered);
      io.off(API.Events.HostChange, hostChange);
    }
  }, [players])

  const sendMessage = useCallback((message: string) => {
    const sendChatMessageEvent: API.SendChatMessageEvent = {
      message,
    }
    io.emit(API.Events.SendChatMessage, sendChatMessageEvent)
  }, [io])

  return <div className="bg-gray-800 h-screen relative max-w-full">
      <div className="px-10 py-5 max-w-full flex flex-wrap">
        {players.map(player => (
          <div className={`text-white font-bold border-gray-800 border-8 -mr-4 h-16 w-16 rounded-full flex justify-center items-center ${twBackgroundClassForColor(colorForString(player.id))}`}>
            {host && host.id === player.id && <span className="absolute top-4">👑</span>}
            {player.name[0].toUpperCase()}
          </div>
        ))}
      </div>
      <div className="flex flex-col max-h-full">
        <div className="max-h-full relative overflow-y-auto" ref={messageContainerRef} >
          <div className="px-10 pb-10 pb-24">
            {messages.map((message, index) => typeof message === 'string'
              ? <div key={index} className="text-gray-500 text-center font-italic text-xs">{message}</div>
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
        </div>
      </div>
      <div className="absolute left-0 bottom-0 p-10 w-full">
        <form className="flex shadow-lg w-full overflow-hidden rounded-lg mt-2" onSubmit={form.handleSubmit}>
          <input name="message" value={form.values.message} onChange={form.handleChange} placeholder="Nachricht eingeben..." className="p-2 px-4 text-white bg-transparent flex-grow bg-gray-700 " />
          <button type="submit" name="message" className="px-5 bg-purple-500 font-bold text-white" disabled={!form.isValid}>Senden</button>
        </form>
      </div>
    </div>
}

export default Chat;
