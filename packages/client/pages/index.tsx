import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useCreateGameMutation from "../hooks/use-create-game-mutation";

const HomePage: NextPage = () => {
  const router = useRouter();
  const createGameMutation = useCreateGameMutation()
  const [joinGameValue, setJoinGameValue] = useState("");

  const createRemoteGame = useCallback(async () => {
    const createGameResult = await createGameMutation.mutateAsync();
    router.push(`/${createGameResult.gameId}`);
  }, [createGameMutation]);

  const joinGame = useCallback(() => {
    router.push(`/${joinGameValue}`);
  }, [joinGameValue, router])

  return <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-300 via-purple-400 to-green-300">
    <div className="p-10 sm:py-20 w-full">
      <h1 className="text-center text-5xl md:text-8xl shadows-into-light transform -skew-y-6">Never Have<br />I Ever<small>.de</small></h1>
      {Boolean(router.query['join-game-error']) &&
        <div className="border-2 border-red-500 p-5 rounded-lg mt-5 item-center">
          <strong>Dem Spiel konnte nicht beigetreten werden!</strong> Bitte überprüfe die Schreibweise der URL oder erstelle eine neues Spiel.
        </div>
      }
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 flex-grow">
      <div className="flex flex-col items-center justify-center px-10">
        <div className="p-1 px-2 text-xs border border-purple-500 rounded-lg font-bold text-purple-500">Kommt bald</div>
        <h2 className="text-2xl mt-2">Lokal auf einem Gerät spielen</h2>
        <p className="text-center mt-2">Ideal für Parties, Sit-Ins oder einfach zum Ausprobieren.</p>
        <button disabled className="p-2 px-4 bg-purple-500 text-white font-bold rounded-lg opacity-50 mt-2">Offline spielen</button>
      </div>
      <div className="flex flex-col items-center justify-center px-10">
        <h2 className="text-2xl mt-2">Online Spiel erstellen</h2>
        <p className="text-center mt-2">Erstelle ein Onlinespiel und teile den Beitrittscode mit Freunden, Kollegen oder den Randoms auf der Party</p>
        <button onClick={createRemoteGame} className="bg-purple-500 p-2 px-4 font-bold text-white rounded-lg mt-2">Spiel erstellen</button>
      </div>
      <div className="flex flex-col items-center justify-center px-10">
        <h2 className="text-2xl mt-2">Einem Spiel beitreten</h2>
        <p className="text-center mt-2">Es gibt bereits ein Spiel? Cool, dann gib den Code ein uns leg direkt lost!</p>
        <div className="flex w-full mt-2">
          <input className="flex-grow p-2 border-2 border-r-0 rounded-l-lg" value={joinGameValue} onChange={event => setJoinGameValue(event.currentTarget.value)} />
          <button className="bg-purple-500 p-2 px-4 font-bold text-white rounded-r-lg disabled:opacity-50" onClick={joinGame}>
            Spiel beitreten
          </button>
        </div>
      </div>
    </div>
  </div>
}

export default HomePage;
