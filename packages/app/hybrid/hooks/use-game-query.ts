import { RestGetGameData } from "@nhie/api";
import axios from "axios";
import { useQuery } from "react-query";
import { BACKEND_URL } from "../constants/networking";

const useGameQuery = (gameId: string) => useQuery(['game', gameId], async () => {
  const response = await axios.get<RestGetGameData>(`${BACKEND_URL}/game/${gameId}`)
  return response.data;
})

export default useGameQuery;
