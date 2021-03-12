import { useEffect } from "react";

const useSocketHandler = <E>(io: SocketIOClient.Socket, event: string, handler: (e: E) => void) => {
  useEffect(() => {
    io.on(event, handler);
    return () => {
      io.off(event, handler)
    };
  }, [io, event, handler])
}

export default useSocketHandler;
