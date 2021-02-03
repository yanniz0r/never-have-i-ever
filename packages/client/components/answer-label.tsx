import { FC } from "react";

interface AnswerLabelProps {
  answer?: boolean;
}

const AnswerLabel: FC<AnswerLabelProps> = ({ answer, children }) => {
  if (answer === undefined) {
    return <>{children}</>;
  }
  return <>{ answer ? '😈' : '😇'}</>
}

export default AnswerLabel;
