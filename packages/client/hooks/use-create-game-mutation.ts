import { useMutation } from "react-query";
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const useCreateGameMutation = () => useMutation(async () => {
  const response = await fetch(`${publicRuntimeConfig.backendUrl}/game`, {
    method: 'POST'
  });
  const json = await response.json()
  return json as { gameId: string };
});

export default useCreateGameMutation;
