import { useFormik } from "formik";
import { FC } from "react";
import Input from "./input";
import Modal from "./modal";
import * as yup from 'yup';

const UsernameModal: FC<{ onSubmit(username: string) }> = ({ onSubmit }) => {
  const form = useFormik<{ username: string }>({
    initialValues: {
      username: '',
    },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .trim()
        .required('Du musst einen Benutzernamen angeben')
        .max(32, 'Der Name darf maximal 32 Zeichen lang sein')
    }),
    onSubmit(values) {
      onSubmit(values.username);
    }
  });
  return <Modal>
    <h2 className="text-xl font-bold">Dem Spiel beitreten</h2>
    <p className="text-md mt-3 text-gray-500">Sag uns wie du heißt und du bist gleich mit dabei!</p>
    <form onSubmit={form.handleSubmit}>
      <div className="flex mt-2">
        <Input name="username" value={form.values.username} onChange={form.handleChange} />
        <button type="submit" className="bg-purple-500 text-white p-2 px-4 rounded-lg ml-2">Beitreten</button>
      </div>
      {form.errors.username && form.touched.username && <div className="mt-2 text-red-500">{form.errors.username}</div>}
    </form>
  </Modal>
}

export default UsernameModal;
