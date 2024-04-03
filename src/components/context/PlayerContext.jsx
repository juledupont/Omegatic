import React, { useState, useContext, createContext } from "react";
import { SocketContext } from "./SocketContext";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  const socket = useContext(SocketContext);
  const [room, setRoom] = useState(null);
  const [username, setUsername] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [myPlayer, setMyPlayer] = useState(null);

  const updatePlayerList = (newPlayerList) => {
    setPlayerList(newPlayerList);
  };

  const updateMyPlayer = (player) => {
    setMyPlayer(player);
  };

  const createRoom = () => {
    return new Promise((resolve, reject) => {
      const username = document.getElementById("usernameInput").value;
      setUsername(username);
      if (username !== "") {
        socket.emit("create_room", {
          username,
        });
        socket.on("room_created", (data) => {
          console.log(`room_created ${data}`);
          setRoom(data);
          resolve(true);
        });
      } else {
        reject(false);
      }
    });
  };

  const joinRoom = () => {
    return new Promise((resolve, reject) => {
      const room = document.getElementById("roomCodeInput").value;
      const username = document.getElementById("usernameInput").value;
      setUsername(username);
      if (room !== "" && username !== "") {
        socket.emit("join_room", {
          username,
          room,
        });

        socket.on("room_code", (data) => {
          console.log(`room_joined ${data}`);
          setRoom(data);
          resolve(true);
        });

        socket.on("room_not_found", (data) => {
          console.log(`room_not_found ${data}`);
          setRoom(null);
          reject(false);
        });
      }
    });
  };

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    setRoom(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        room,
        username,
        playerList,
        myPlayer,
        updateMyPlayer,
        createRoom,
        joinRoom,
        updatePlayerList,
        leaveRoom,
        setUsername,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerProvider, PlayerContext };
