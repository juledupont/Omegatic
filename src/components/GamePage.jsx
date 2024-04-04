import NavBar from "./NavBar";
import GameBoard from "./GameBoard";
import React, { useContext, useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { PlayerContext } from "./context/PlayerContext";
import { SocketContext } from "./context/SocketContext";
import { useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";

export default function GamePage() {
    const socket = useContext(SocketContext);
    const { room, playerList, updatePlayerList, updateMyPlayer } = useContext(PlayerContext);
    const navigate = useNavigate();
    const [started, setStarted] = useState(false);

    const startGame = () => {
        socket.emit("start_game", {
          room,
        });
      }



    useEffect(() => {
        socket.on("chatroom_users", (data) => {
          updatePlayerList(data);
        });

        
        socket.on("game_started", (data) => {
            setStarted(true);
            updateMyPlayer(data.player);
          });
    
    
        return () => {
          socket.off("chatroom_users");
            socket.off("game_started");
        };
      }, [socket, room, navigate, playerList]);

    return (
        <div style={{minWidth: "min-content"}}>
            <NavBar/>
            {!started && playerList.length < 2 && <h1>Waiting for another player...</h1>}
            {playerList.length === 2 && !started && <Button onClick={startGame}>Start Game</Button>}
            {started && <GameBoard />}

        </div>
    );
}