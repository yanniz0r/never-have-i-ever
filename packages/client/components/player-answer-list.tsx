import { IPlayer } from '@nhie/api';
import React, { FC, useLayoutEffect, useState } from 'react';
import { colorForString, twBackgroundClassForColor } from '../util/color-utils';
import AnswerLabel from './answer-label';

interface PlayerAnswerListProps {
  players: IPlayer[],
  answers: Record<string, boolean>,
}

const twColsClassForPlayerAmount = (player: number) => {
  if (player === 1) {
    return 'grid-cols-1';
  } else if (player < 6) {
    return 'grid-cols-2';
  } else if (player < 12) {
    return 'grid-cols-3';
  } else {
    return 'grid-cols-4';
  }
}

const PlayerAnswerList: FC<PlayerAnswerListProps> = ({ players, answers }) => {
  const [revealIndex, setRevealIndex] = useState(0);

  useLayoutEffect(() => {
    if (revealIndex < players.length) {
      const timeoutId = setTimeout(() => {
        setRevealIndex(revealIndex + 1);
      }, 1000)
    }
  }, [revealIndex, players.length])

  return <div className={`grid ${twColsClassForPlayerAmount(players.length)} gap-16`}>
    {players.map((player, index) => {
      const answer = answers[player.id];
      return <div key={player.id} className={`flex justify-center items-center flex-col transform transition ${revealIndex > index ? 'scale-1' : 'scale-0'}`}>
        <div className={`w-24 h-24 text-5xl flex items-center justify-center rounded-full ${twBackgroundClassForColor(colorForString(player.id))}`}>
          <AnswerLabel answer={answer}>{player.name[0].toUpperCase()}</AnswerLabel>
        </div>
        <span className={`${answer ? 'bg-red-500' : 'bg-green-500'} text-xs p-1 my-4 font-bold rounded-sm`}>{answer ? 'Schuldig' : 'Unschuldig'}</span>
        <h3 className="text-2xl">{player.name}</h3>
      </div>
    })}
  </div>
}

export default PlayerAnswerList;
