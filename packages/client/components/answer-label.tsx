import { FC } from "react";

interface AnswerLabelProps {
  answer?: boolean;
}

const AnswerLabel: FC<AnswerLabelProps> = ({ answer }) => {
  return <>{ answer ? '😇' : answer === undefined ? '🐰' :'😈'}</>
}

export default AnswerLabel;
