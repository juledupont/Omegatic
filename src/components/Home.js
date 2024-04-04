import React, { useContext, useEffect } from "react";
import { Grid, Header, Form, Segment, Icon } from "semantic-ui-react";
import { PlayerContext } from "./context/PlayerContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const { room, username, joinRoom, createRoom, soloPlay } = useContext(PlayerContext);

    const roomCodeInput = document.getElementById("roomCodeInput");

    const joinRoomNavigate = async () => {
        try {
          await joinRoom();
          navigate("/game/" );
        } catch (error) {
        }
      };

    const createRoomNavigate = async () => {
      try {
        await createRoom();
        navigate("/game");
      } catch (error) {
      }
    }

    const soloNavigate = async () => {
      try {
        await soloPlay();
        navigate("/solo");
      } catch (error) {
      }
    }
    
    return (
      <div>
      <NavBar/>
          <Grid color="black" textAlign="center" style={{ height: "90vh",}} verticalAlign="middle">
              <Grid.Column style={{maxWidth: "30em" }}>
                  <Header as="h1" textAlign="center">
                      Rejoindre une partie
                  </Header>
                  <Segment stacked>
                      <Form size="large">
                          <Form.Input
                          name="Nom d'utilisateur"
                          placeholder="Nom d'utilisateur"
                          autoComplete="off"
                          id="usernameInput"
                          />

                          <Form.Input
                          name="Code de la partie"
                          placeholder="Code de la partie"
                          autoComplete="off"
                          id="roomCodeInput" />
                          <Form.Group widths="equal" style={{marginBottom: 0}}>
                              <Form.Button fluid
                              color="green" 
                              size="large" 
                              type="submit"
                              onClick={joinRoomNavigate}
                              >
                              <Icon name='group'/> Rejoindre
                              </Form.Button>
                              <Form.Button inverted fluid
                              color="green" 
                              size="large" 
                              type="submit"
                              onClick={createRoomNavigate}
                              >                        
                              <Icon name='plus'/> Créer
                              </Form.Button>
                          </Form.Group>
                      </Form>
                  </Segment>
                  <Segment>
                    <Form.Button fluid
                    color="green"
                    size="large"
                    type="submit"
                    onClick={soloNavigate}
                    >
                    <Icon name='user'/> Solo
                    </Form.Button>
                  </Segment>
               </Grid.Column>
          </Grid>
      </div>
    );

}
