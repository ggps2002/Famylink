import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { BACKEND_API_URL } from './url';

const useSocket = () => {
  const { user } = useSelector((state) => state.auth);
  const { _id } = user || {};
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (_id && !socket) {
      const newSocket = io(BACKEND_API_URL, {
        query: { userId: _id },
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        // console.log("Socket connected");
      });

      newSocket.on("disconnect", () => {
        // console.log("Socket disconnected");
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.disconnect();
          setSocket(null);
        }
      };
    }
  }, [_id]);

  return { socket, isConnected };
};

export default useSocket;