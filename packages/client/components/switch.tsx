import { FC } from "react";

interface SwitchProps {
  value: boolean;
  onChange?(value: boolean): void;
}

const Switch: FC<SwitchProps> = ({ onChange, value }) => {
  return <button type="button" className="bg-gray-100 p-1.5 rounded-full" onClick={() => onChange(!value)}>
    <div className={`w-12 transition ${value ? 'bg-purple-500' : 'transparent'} rounded-full`}>
      <div className={`h-6 w-6 bg-white rounded-full transform transition scale-110 ${value ? 'translate-x-full' : ''}`}/>
    </div>
  </button>
}

export default Switch;
