import { NextPage } from "next";
import useGames from "../hooks/use-games";



const GamesPage: NextPage = () => {
  const gamesQuery = useGames();
  return <div>
    <table className="table-auto">
      <thead>
        <tr>
          <th className="p-2 border-2">Spielname</th>
          <th className="p-2 border-2">Rundenzeit</th>
          <th className="p-2 border-2">Spieler</th>
          <th className="p-2 border-2">Aktuelle Frage</th>
          <th className="p-2 border-2"/>
        </tr>
      </thead>
      <tbody>
        {gamesQuery.isSuccess && gamesQuery.data.map(game => (
          <tr>
            <td className="p-2 border-2">{game.id}</td>
            <td className="p-2 border-2">{game.maxTime}</td>
            <td className="p-2 border-2">{game.players}</td>
            <td className="p-2 border-2">{game.currentQuestion.text}</td>
            <td className="p-2 border-2">
              <a className="bg-purple-500 p-2 rounded-lg text-white font-bold" href={`/${game.id}`}>Beitreten</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

export default GamesPage;
