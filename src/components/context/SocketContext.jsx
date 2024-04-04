import React, { useState, useEffect, useContext, createContext } from "react";
import {io} from "socket.io-client";


const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
        //const newSocket = io.connect("https://omegatic-app-helios.koyeb.app");
        const newSocket = io.connect("http://localhost:4000");
        setSocket(newSocket);

        return () => {
            newSocket.close();
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
    }

export { SocketProvider, SocketContext };