import { useMutation } from "react-query";

const useCreateGameMutation = () => useMutation(async () => {
  const response = await fetch('http://localhost:4000/game', {
    method: 'POST'
  });
  const json = await response.json()
  return json as { gameId: string };
});

export default useCreateGameMutation;
