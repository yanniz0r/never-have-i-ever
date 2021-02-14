import { Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import { FC } from "react";
import * as yup from "yup";
import useCreateGameMutation from "../hooks/use-create-game-mutation";
import Input from "./input";
import Modal, { ModalProps } from "./modal";
import Switch from "./switch";

interface FormData {
  time: number;
  isPublic: boolean;
  maxPlayers: number;
}

const CreateGameModal: FC<ModalProps> = (props) => {
  const createGameMutation = useCreateGameMutation();
  const router = useRouter();
  const form = useFormik<FormData>({
    validationSchema: yup.object().shape({
      time: yup
        .number()
        .required("Bitte gib hier ein, wie lange die Spieler zum Antworten Zeit haben")
        .min(10, "Spieler müssen mindestens 10 Sekunden Zeit zum antworten haben")
        .max(60, "Spieler dürfen maximal 60 Sekunden zum antworten haben"),
      maxPlayers: yup
        .number()
        .required("Bitte gib hier eine, wie viele Spieler deinem Spiel beitreten dürfen")
        .min(1, "Spiele ohne Spieler sind keine Spiele. Wähle einen Wert größer als 0.")
        .max(64, "Die maximale Spielerzahl ist 64"),
    }),
    initialValues: {
      isPublic: false,
      maxPlayers: 20,
      time: 30,
    },
    async onSubmit(values) {
      const createGameResult = await createGameMutation.mutateAsync({
        public: values.isPublic,
        maxTime: values.time,
        maxPlayers: values.maxPlayers,
      });
      router.push(`/${createGameResult.gameId}`);
    }
  });

  return <Modal {...props}>
    <form onSubmit={form.handleSubmit}>
      <h2 className="text-xl font-bold">Ein Spiel erstellen</h2>
      <p className="text-md mt-3 text-gray-500">Sag uns ein bisschen was, damit wir das Spiel für dich erstellen können!</p>
      <label className="mt-5 block">
        <span className="text-purple-500 font-bold">Antwortzeit</span>
        <Input type="number" name="time" value={form.values.time} onChange={form.handleChange} />
        {form.touched.time && form.errors.time && <div className="mt-1 text-red-500">{form.errors.time}</div>}
      </label>
      <label className="mt-5 block">
        <span className="text-purple-500 font-bold">Maximale Spieleranzahl</span>
        <Input type="number" name="maxPlayers" value={form.values.maxPlayers} onChange={form.handleChange} />
        {form.touched.maxPlayers && form.errors.maxPlayers && <div className="mt-1 text-red-500">{form.errors.maxPlayers}</div>}
      </label>
      <div className="mt-5 block">
        <span className="text-purple-500 font-bold">Erreichbarkeit</span>
        <div className="flex justify-start items-center">
          <Switch value={form.values.isPublic} onChange={(isPublic) => form.setValues({ ...form.values, isPublic })} /><span className="ml-2 text-gray-500">Öffentlich erreichbar?</span>
        </div>
      </div>
      <button disabled={form.isSubmitting} type="submit" className="bg-purple-500 px-4 py-2 text-xl rounded-lg mt-5 text-white hover:scale-110 transition transform disabled:opacity-50">Spiel erstellen</button>
    </form>
  </Modal>
}

export default CreateGameModal;
