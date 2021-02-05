import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import useCreateGameMutation from "../hooks/use-create-game-mutation";
import Modal, { ModalProps } from "./modal";
import Switch from "./switch";

const CreateGameModal: FC<ModalProps> = (props) => {
  const [isPublic, setPublic] = useState(false);
  const [time, setTime] = useState(30);
  const createGameMutation = useCreateGameMutation();
  const router = useRouter();

  const createRemoteGame = useCallback(async () => {
    const createGameResult = await createGameMutation.mutateAsync({
      public: isPublic,
      maxTime: time,
    });
    router.push(`/${createGameResult.gameId}`);
  }, [createGameMutation]);

  return <Modal {...props}>
    <h2 className="text-xl font-bold">Ein Spiel erstellen</h2>
    <p className="text-md mt-3 text-gray-500">Sag uns ein bisschen was, damit wir das Spiel für dich erstellen können!</p>
    <label className="mt-5 block">
      <span className="text-purple-500 font-bold">Antwortzeit</span>
      <input type="number" value={time} onChange={event => setTime(Number(event.currentTarget.value))} min="10" max="60" className="bg-gray-100 p-2 w-full rounded-lg" />
    </label>
    <div className="mt-5 block">
      <span className="text-purple-500 font-bold">Erreichbarkeit</span>
      <div className="flex justify-start items-center">
        <Switch value={isPublic} onChange={setPublic} /><span className="ml-2 text-gray-500">Öffentlich erreichbar?</span>
      </div>
    </div>
    <button onClick={createRemoteGame} className="bg-purple-500 px-4 py-2 text-xl rounded-lg mt-5 text-white hover:scale-110 transition transform">Spiel erstellen</button>
  </Modal>
}

export default CreateGameModal;
