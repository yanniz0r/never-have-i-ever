import Head from 'next/head'
import socketio from 'socket.io-client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as API from '@nhie/api';
import { MdThumbUp, MdThumbDown } from 'react-icons/md'
import Chat from '../components/chat';
import { GetServerSideProps, NextPage } from 'next';
import { fetchGame } from '../hooks/use-game'
import getConfig from 'next/config'
import PlayerAnswerList from '../components/player-answer-list';
import Countdown from '../components/countdown';
import Modal from '../components/modal';
import { FaShare } from 'react-icons/fa';
import { ApiError } from 'next/dist/next-server/server/api-utils';
import { Router, useRouter } from 'next/router';

const { publicRuntimeConfig } = getConfig()

interface GameProps {
  gameId: string;
  players: API.IPlayer[];
  host: API.IPlayer | null;
  question: API.IQuestion;
  phase: API.Phase;
}

const Game: NextPage<GameProps> = (props) => {
  const router = useRouter();
  const [players, setPlayers] = useState<API.IPlayer[]>(props.players);
  const [host, setHost] = useState<API.IPlayer | null>(props.host);
  const [myId, setMyId] = useState<string>()
  const [username, setUsername] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [question, setQuestion] = useState<API.IQuestion>(props.question);
  const [phase, setPhase] = useState<API.Phase>(props.phase);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalJustCopied, setShareModalJustCopied] = useState(false);
  const [countdownEnd, setCountdownEnd] = useState<Date>();
  const isHost = useMemo(() => host && myId === host.id, [myId, host]);

  const io = useMemo(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const io = socketio(publicRuntimeConfig.backendUrl)
    io.on(API.Events.PlayerJoined, (event: API.PlayerJoinedEvent) => {
      setPlayers(event.players);
    })
    io.on(API.Events.PlayerLeft, (event: API.PlayerLeftEvent) => {
      setPlayers(event.players);
    })
    io.on(API.Events.ShowQuestion, (event: API.ShowQuestionEvent) => {
      setQuestion(event.question);
    })
    io.on(API.Events.StartCountdown, (event: API.StartCountdownEvent) => {
      setCountdownEnd(new Date(event.endDate));
    })
    io.on(API.Events.PhaseChange, (event: API.PhaseChangeEvent) => {
      if (event.phase === API.Phase.Answer) {
        setHasAnswered(false);
      }
      setAnswers(event.answers);
      setPhase(event.phase);
    })
    io.on(API.Events.HostChange, (event: API.HostChangeEvent) => {
      setHost(event.host);
    })
    return io
  }, []);

  useEffect(() => {
    if (!io) return;
    const enter: API.EnterGameEvent = {
      game: String(props.gameId)
    }
    const ack: API.EnterGameAck = (status) => {
      switch(status) {
        case 'success':
          break;
        default:
          router.push(`/?join-game-error=${status}`);
      }
    }
    io.emit(API.Events.Enter, enter, ack)
  }, [io, props.gameId])

  const login = useCallback(() => {
    const joinEvent: API.JoinEvent = {
      name: username
    }
    io.emit(API.Events.Join, joinEvent, setMyId);
  }, [username])

  const yay = useCallback(() => {
    setHasAnswered(true);
    const playerAnswerEvent: API.AnswerEvent = {
      answer: true
    };
    io.emit(API.Events.Answer, playerAnswerEvent);
  }, [])

  const nay = useCallback(() => {
    setHasAnswered(true);
    const playerAnswerEvent: API.AnswerEvent = {
      answer: false
    };
    io.emit(API.Events.Answer, playerAnswerEvent);
  }, [])

  const continueGame = useCallback(() => {
    io.emit(API.Events.Continue);
  }, [])

  return <>
    <style jsx>{`
      .page-grid {
        display: grid;
        grid-template-columns: 1fr 3fr;
      }

      @media (max-width: 1630px) {
        .page-grid {
          grid-template-columns: 1fr;
          grid-template-rows: 4fr 1fr;
        }
        .chat {
          height: 30vh;
        }
        .game {
          background: green;
          order: -1;
        }
      }
    `}</style>
    <Head>
      <title>{question.text ? question.text : 'Ich habe noch nie...'}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="w-screen h-screen relative">
      {!myId &&
        <Modal>
          <h2 className="text-xl font-bold">Dem Spiel beitreten</h2>
          <p className="text-md mt-3 text-gray-500">Sag uns wie du heißt und du bist gleich mit dabei!</p>
          <div className="flex mt-5">
            <input type="text" value={username} className="flex-grow border-t border-b border-l border-gray-200 rounded-l-xl p-2" onChange={(event) => setUsername(event.currentTarget.value)} />
            <button onClick={login} className="bg-purple-500 text-white p-2 px-4 rounded-r-xl">Beitreten</button>
          </div>
        </Modal>
      }
      {shareModalOpen &&
        <Modal close={() => setShareModalOpen(false)}>
          <h2 className="text-xl font-bold">Zum Spiel einladen</h2>
          <p className="text-md mt-3 text-gray-500">Kopiere dir einfach den untenstehenden Code und teile ihn mit deinen Mitspielern. Wenn du sie magst, kannst du ihnen auch einfach den Link schicken.</p>
          <input
            value={props.gameId}
            onClick={() => {
              navigator.clipboard.writeText(props.gameId);
              setShareModalJustCopied(true);
              setTimeout(() => {
                setShareModalJustCopied(false);
              }, 2000);
            }}
            className="font-mono cursor-pointer bg-gray-100 p-2 w-full rounded-lg mt-4"
          />
          <span className={`inline-block text-white bg-black p-1 text-xs rounded-lg transition transform ${shareModalJustCopied ? 'scale-100' : 'scale-0'}`}>
            Kopiert
          </span>
        </Modal>
      }
      <main className="page-grid h-full" style={{ filter: myId ? 'none' : 'blur(2px)' }}>
        <div className="chat">
          <Chat io={io} players={players} />
        </div>
        <div className="game relative">
          <div className="absolute bottom-12 right-12">
            <button onClick={() => setShareModalOpen(true)} className="flex text-white text-opacity-50 hover:text-opacity-80 transition justify-center items-center flex-col">
              <FaShare className="text-xl md:text-4xl"/>
              <span className="text-xs">Teilen</span>
            </button>
          </div>
          {phase === API.Phase.RevealAnswers && <div className="text-white bg-gray-900 flex flex-col items-center justify-center h-full">
            <div className="p-10">
              <h2 className="text-gray-500 text-center uppercase mb-4">Auflösung</h2>
              <h1 className="text-white text-center shadows-into-light text-5xl">{question?.text}</h1>
            </div>
            <div className="flex-grow flex justify-center items-center">
              <PlayerAnswerList players={players} answers={answers} />
            </div>
            {isHost &&
              <div className="p-10">
                <button onClick={continueGame} className="bg-purple-500 text-white font-bold p-2 px-4 rounded-lg">Nächste Frage</button>
              </div>
            }
          </div>}
          {phase === API.Phase.Answer && <div className="flex justify-center items-center flex-col bg-gradient-to-r from-purple-500 to-purple-900 p-10 h-full">
            <Countdown endDate={countdownEnd} />
            <h1 className="flex flex-col text-center">
              <small className="text-3xl text-white uppercase tracking-wider text-gray-200 flex-shrink">
                Die Frage...
              </small>
              <span className="text-5xl text-white mt-4 font-bold shadows-into-light">
                {question?.text}
              </span>
            </h1>
            <p className="mt-16 mb-5 text-center">Jetzt bist du gefragt! Hast du das schonmal gemacht/getan?</p>
            <div className="grid gap-5 grid-cols-2">
              <button disabled={hasAnswered} onClick={yay} className="disabled:opacity-50 text-4xl h-24 w-24 bg-green-500 rounded-full flex flex-col justify-center items-center text-white"><MdThumbUp /><span className="text-xs">Stimmt</span></button>
              <button disabled={hasAnswered} onClick={nay} className="disabled:opacity-50 text-4xl h-24 w-24 bg-red-500 rounded-full flex flex-col justify-center items-center text-white"><MdThumbDown /><span className="text-xs">Stimmt nicht</span></button>
            </div>
          </div>}
        </div>
      </main>
    </div>
  </>
}

export default Game;

export const getServerSideProps: GetServerSideProps<GameProps> = async (context) => {
  const gameId = String(context.query['gameId']);
  try {
    const game = await fetchGame(gameId);
    return {
      props: {
        gameId,
        players: game.players,
        question: game.question,
        phase: game.phase,
        host: game.host || null,
      }
    }
  } catch (e) {
    console.warn(`An error occurred while joining the game with id ${gameId}`, e);
    return {
      redirect: {
        destination: '/?join-game-error=not-existing',
        permanent: true,
      }
    }
  }
}
