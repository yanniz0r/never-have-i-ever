import { useQuery } from "react-query";
import * as API from '@nhie/api'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const fetchGames = async () => {
  const data = await fetch(`${publicRuntimeConfig.backendUrl}/games`);
  const json = await data.json();
  return json as API.RestGetGamesData;
}

const useGames = () => useQuery(['game'], () => fetchGames())

export default useGames;
