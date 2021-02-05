import { useMutation } from "react-query";
import getConfig from 'next/config'
import { RestPostGameData } from "@nhie/api";

const { publicRuntimeConfig } = getConfig()

const useCreateGameMutation = () => useMutation(async (data: RestPostGameData) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch(`${publicRuntimeConfig.backendUrl}/game`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  });
  const json = await response.json()
  return json as { gameId: string };
});

export default useCreateGameMutation;
