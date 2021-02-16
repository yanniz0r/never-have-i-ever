import { FC, HTMLProps } from "react";

interface InputProps extends HTMLProps<HTMLInputElement> {}

const Input: FC<InputProps> = ({...props}) => {
  return <input {...props} className="bg-gray-100 min-w-0 p-2 w-full rounded-lg" />
}

export default Input;
