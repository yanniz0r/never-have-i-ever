import { FC } from "react";
import { FaBeer, FaCandyCane } from 'react-icons/fa'

interface AnswerLabelProps {
  answer?: boolean;
}

const AnswerLabel: FC<AnswerLabelProps> = ({ answer, children }) => {
  if (answer === undefined) {
    return <>{children}</>;
  }
  return answer ? <FaBeer /> : <FaCandyCane />;
}

export default AnswerLabel;
