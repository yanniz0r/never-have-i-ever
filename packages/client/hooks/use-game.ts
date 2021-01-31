import { useQuery } from "react-query";
import * as API from '@nhie/api'

export const fetchGame = async (id: string) => {
  const data = await fetch(`http://localhost:4000/game/${id}`);
  const json = await data.json();
  return json as API.RestGetGameData;
}

const useGame = (id: string) => useQuery(['game', id], () => fetchGame(id))

export default useGame;
