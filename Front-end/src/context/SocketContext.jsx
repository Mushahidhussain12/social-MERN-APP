import { createContext, useContext, useEffect } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import { DivertUser } from "../atoms/DivertUser";
import { useState } from "react";

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketContext = createContext();
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(DivertUser);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: {
        userId: user?._id,
      },
    });

    setSocket(socket);

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
    //useEffect cleanup
    return () => socket && socket.close();
  }, [user?._id]);
  console.log(onlineUsers, "online users");

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
