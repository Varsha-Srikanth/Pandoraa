import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const socket = io("http://localhost:3001");
        setSocket(socket);

        return () => {
            socket.close();
            setSocket(null);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
