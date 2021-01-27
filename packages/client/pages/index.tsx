import Head from 'next/head'
import styles from '../styles/Home.module.css'
import socketio from 'socket.io-client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as API from '@nhie/api/dist/index';

export default function Home() {
  const [players, setPlayers] = useState<API.IPlayer[]>([]);
  const [username, setUsername] = useState<string>("");
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
  }, [username])  

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <input type="text" value={username} onChange={(event) => setUsername(event.currentTarget.value)} />
        <button onClick={login}>Login</button>
       <h1>Players</h1>
       <ol>
         {players.map((player, index) => (
           <li key={index}>{player.name}</li>
         ))}
       </ol>
       <h1>Question</h1>
       {question}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
