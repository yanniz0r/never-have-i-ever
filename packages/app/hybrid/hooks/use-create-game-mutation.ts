import axios from "axios";
import { useMutation } from "react-query";
import { BACKEND_URL } from '../constants/networking'
import { RestPostGameData } from '@nhie/api';

interface CreateGameResponse {
  gameId: string;
}

const useCreateGameMutation = () => useMutation(async (data: RestPostGameData) => {
  try {
    const response = await axios.post<CreateGameResponse>(`${BACKEND_URL}/game`, data)
    return response.data;
  } catch (e) {
    console.log(e)
    throw e;
  }
})

export default useCreateGameMutation;
