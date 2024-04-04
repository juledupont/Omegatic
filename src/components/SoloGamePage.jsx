import NavBar from "./NavBar";
import GameBoard from "./GameBoard";
import React, { useContext, useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { PlayerContext } from "./context/PlayerContext";
import { SocketContext } from "./context/SocketContext";
import { useNavigate } from "react-router-dom";
import { Button, Container, Header } from "semantic-ui-react";
import SoloGameBoard from "./SoloGameBoard";


export default function SoloGamePage() {
    const { updateMyPlayer } = useContext(PlayerContext);
    const [started, setStarted] = useState(false);


    return (
        <div style={{minWidth: "min-content"}}>
            <NavBar/>
            {!started && 
            <Container textAlign="center">
                <Header as="h2">Choose your player</Header>
                <Button onClick={() => {updateMyPlayer("X"); setStarted(true);}}>X</Button>
                <Button onClick={() => {updateMyPlayer("O"); setStarted(true);}}>O</Button>
            </Container>
            }

            {started && <SoloGameBoard />}
            


        </div>
    );
}