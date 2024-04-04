import React, { useState, useContext, createContext } from "react";
import { SocketContext } from "./SocketContext";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  const socket = useContext(SocketContext);
  const [room, setRoom] = useState(null);
  const [username, setUsername] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [myPlayer, setMyPlayer] = useState(null);
  const [allRooms, setAllRooms] = useState([]);

  const updatePlayerList = (newPlayerList) => {
    setPlayerList(newPlayerList);
  };

  const updateMyPlayer = (player) => {
    setMyPlayer(player);
  };

  const updateUsername = (username) => {
    setUsername(username);
  };

  const listAllRooms = () => {
    return new Promise((resolve, reject) => {
      socket.emit("list_rooms");
      socket.on("room_list", (data) => {
        setAllRooms(data);
        resolve(true);
      });
    });

  }

  const createRoom = () => {
    return new Promise((resolve, reject) => {
      if (username !== "") {
        socket.emit("create_room", {
          username,
        });
        socket.on("room_created", (data) => {
          setRoom(data);
          resolve(true);
        });
      } else {
        reject(false);
      }
    });
  };

  const joinRoom = (room) => {
    return new Promise((resolve, reject) => {
      if (room !== "" && username !== "") {
        socket.emit("join_room", {
          username,
          room,
        });

        socket.on("room_code", (data) => {
          setRoom(data);
          resolve(true);
        });

        socket.on("room_not_found", (data) => {
          setRoom(null);
          reject(false);
        });
      }
    });
  };

  const soloPlay = () => {
    setUsername("Player 1");
    setRoom("solo");
  };

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    setRoom(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        socket,
        room,
        username,
        playerList,
        myPlayer,
        allRooms,
        soloPlay,
        updateMyPlayer,
        createRoom,
        joinRoom,
        updatePlayerList,
        leaveRoom,
        updateUsername,
        listAllRooms,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerProvider, PlayerContext };
