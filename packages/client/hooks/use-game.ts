import { useQuery } from "react-query";
import * as API from '@nhie/api'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const fetchGame = async (id: string) => {
  const data = await fetch(`${publicRuntimeConfig.backendUrl}/game/${id}`);
  const json = await data.json();
  return json as API.RestGetGameData;
}

const useGame = (id: string) => useQuery(['game', id], () => fetchGame(id))

export default useGame;
