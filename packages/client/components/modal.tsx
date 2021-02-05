import React, { FC } from "react"

interface ModalProps {
  close?(): void;
}

const Modal: FC<ModalProps> = ({ children, close }) => {
  return <div onClick={close} className="absolute bg-opacity-50 bg-black flex flex-col w-full h-full justify-center items-center z-10">
      <div className="bg-white max-w-screen-md p-7 rounded-xl shadow-lg" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
}

export default Modal;
