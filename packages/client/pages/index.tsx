import Head from 'next/head'
import socketio from 'socket.io-client'
import { useCallback, useMemo, useState } from 'react'
import * as API from '@nhie/api/dist/index';
import { MdThumbUp, MdThumbDown } from 'react-icons/md'

export default function Home() {
  const [players, setPlayers] = useState<API.IPlayer[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [question, setQuestion] = useState<string>();

  const io = useMemo(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const io = socketio('http://localhost:4000')
    io.on(API.Events.PlayerJoined, (event: API.PlayerJoinedEvent) => {
      setPlayers(event.players);
    })
    io.on(API.Events.ShowQuestion, (event: API.ShowQuestionEvent) => {
      setQuestion(event.question);
    })
    return io
  }, []);

  const login = useCallback(() => {
    const setUserDataEvent: API.SetUserDataEvent = {
      name: username
    }
    io.emit(API.Events.SetUserData, setUserDataEvent);
    setLoggedIn(true)
  }, [username])  

  return (
    <div className="w-screen h-screen bg-red-100 relative">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!loggedIn && 
        <div className="absolute flex flex-col w-full h-full justify-center items-center z-5">
          <div className="bg-white p-10">
            <h2 className="text-xl font-bold">Dem Spiel beitreten</h2>
            <p className="text-md mt-1 text-gray-500">Sag uns wie du heißt und du bist gleich mit dabei!</p>
            <div className="flex mt-5">
              <input type="text" value={username} className="flex-grow border-t border-b border-l border-gray-200 rounded-l-xl p-2" onChange={(event) => setUsername(event.currentTarget.value)} />
              <button onClick={login} className="bg-purple-500 text-white p-2 px-4 rounded-r-xl">Beitreten</button>
            </div>
          </div>
        </div>
      }

      <main className="grid grid-cols-2 h-full" style={{ filter: loggedIn ? 'none' : 'blur(2px)' }}>
        <div style={{ background: '#2EC4B6' }}>
          <h1>Players</h1>
          <ol>
            {players.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ol>
        </div>
        <div className="flex justify-center items-center flex-col" style={{ background: '#E71D36' }}>
          <h1 className="flex flex-col text-center">
            <small className="text-3xl text-white uppercase bg-white flex-shrink" style={{ color: '#E71D36' }}>
              Ich habe noch nie...
            </small>
            <span className="text-5xl text-white mt-4">
              {question}
            </span>
          </h1>
          <p className="mt-10 mb-5">Jetzt bist du gefragt! Hast du schonmal {question}?</p>
          <div className="flex flex-row">
            <button className="text-4xl h-24 w-24 bg-green-500 rounded-full flex flex-col justify-center items-center text-white"><MdThumbUp /><span className="text-xs">Yay</span></button>
            <button className="text-4xl h-24 w-24 bg-green-500 rounded-full flex flex-col justify-center items-center text-white"><MdThumbDown /><span className="text-xs">Nay</span></button>
          </div>
        </div>

      </main>
    </div>
  )
}
