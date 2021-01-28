import Head from 'next/head'
import socketio from 'socket.io-client'
import { useCallback, useMemo, useState } from 'react'
import * as API from '@nhie/api/dist/index';
import { MdThumbUp, MdThumbDown } from 'react-icons/md'
import AnswerLabel from '../components/answer-label';

const twColsClassForPlayerAmount = (player: number) => {
  if (player === 1) {
    return 'grid-cols-1';
  } else if (player < 6) {
    return 'grid-cols-2';
  } else if (player < 12) {
    return 'grid-cols-3';
  } else {
    return 'grid-cols-4';
  }
}

export default function Home() {
  const [players, setPlayers] = useState<API.IPlayer[]>([]);
  const [username, setUsername] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [question, setQuestion] = useState<API.IQuestion>();

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
    io.on(API.Events.PlayerAnswered, (event: API.PlayerAnsweredEvent) => {
      setAnswers(event.playerAnswers);
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

  const yay = useCallback(() => {
    const playerAnswerEvent: API.AnswerEvent = {
      answer: true
    };
    io.emit(API.Events.Answer, playerAnswerEvent);
  }, [])

  const nay = useCallback(() => {
    const playerAnswerEvent: API.AnswerEvent = {
      answer: false
    };
    io.emit(API.Events.Answer, playerAnswerEvent);
  }, [])

  return (
    <div className="w-screen h-screen bg-red-100 relative">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!loggedIn && 
        <div className="absolute flex flex-col w-full h-full justify-center items-center z-10">
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
        <div className="text-white bg-gray-900 p-10 flex items-center justify-center">
          <div className={`grid gap-16 ${twColsClassForPlayerAmount(players.length)}`}>
            {players.map((player, index) => (
              <div key={index} className="flex justify-center items-center flex-col">
                <div className="w-24 h-24 text-5xl flex items-center justify-center bg-gray-800 rounded-full">
                  <AnswerLabel answer={answers[player.id]}>{player.name[0]}</AnswerLabel>
                </div>
                <h3 className="text-2xl mt-2">{player.name}</h3>
                <small>{player.id}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center flex-col bg-gradient-to-br from-blue-300 via-purple-400 to-green-300 p-10">
          <h1 className="flex flex-col text-center">
            <small className="text-3xl text-white uppercase tracking-wider text-gray-200 flex-shrink">
              Ich habe noch nie...
            </small>
            <span className="text-5xl text-white mt-4">
              {question?.text}
            </span>
          </h1>
          <p className="mt-16 mb-5 text-center">Jetzt bist du gefragt! Hast du schonmal {question?.text}?</p>
          <div className="grid gap-5 grid-cols-2">
            <button onClick={yay} className="text-4xl h-24 w-24 bg-green-500 rounded-full flex flex-col justify-center items-center text-white"><MdThumbUp /><span className="text-xs">Yay</span></button>
            <button onClick={nay} className="text-4xl h-24 w-24 bg-red-500 rounded-full flex flex-col justify-center items-center text-white"><MdThumbDown /><span className="text-xs">Nay</span></button>
          </div>
        </div>

      </main>
    </div>
  )
}
