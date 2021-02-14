import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";

interface CountdownProps {
  endDate: Date;
}

const Countdown: FC<CountdownProps> = ({ endDate }) => {
  const [seconds, setSeconds] = useState<number>();
  const [newSecond, setNewSecond] = useState(false);
  useEffect(() => {
    setInterval(() => {
      setSeconds(dayjs(endDate).diff(new Date(), 'seconds'))
    }, 1000)
    setSeconds(dayjs(endDate).diff(new Date(), 'seconds'))
  }, [endDate])

  useEffect(() => {
    setNewSecond(true);
    const timeoutId = setTimeout(() => {
      setNewSecond(false);
    }, 250)
    return () => clearTimeout(timeoutId);
  }, [seconds])

  return <div className={seconds <= 0 ? 'invisible' : null}>
    <span className={`text-xl bold block transform transition text-gray-700 ${newSecond ? 'scale-125 text-gray-900' : ''}`}>{seconds}</span>
  </div>
}

export default Countdown;
