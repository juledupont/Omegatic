import React, { useContext, useEffect, useState } from "react";
import { Grid, Header, Form, Segment, Icon, List, Modal, Button } from "semantic-ui-react";
import { PlayerContext } from "./context/PlayerContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { room, username, joinRoom, createRoom, soloPlay, allRooms, listAllRooms, updateUsername } = useContext(PlayerContext);
  const [selectedAction, setSelectedAction] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const joinRoomNavigate = async (roomCode) => {
    try {
      await joinRoom(roomCode);
      navigate("/game/");
    } catch (error) {}
  };

  const createRoomNavigate = async () => {
    try {
      await createRoom();
      navigate("/game");
    } catch (error) {}
  };

  const soloNavigate = async () => {
    try {
      await soloPlay();
      navigate("/solo");
    } catch (error) {}
  };

  const listRooms = async () => {
    try {
      await listAllRooms();
    } catch (error) {}
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <NavBar />
      {!username && (
      <Grid color="black" textAlign="center" style={{ height: "90vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: "30em" }}>
          <Header as="h1" textAlign="center">
            Entrez votre nom
          </Header>
          <Segment stacked>
            <Form size="large">
              <Form.Input
                name="Nom d'utilisateur"
                placeholder="Nom d'utilisateur"
                autoComplete="off"
                id="usernameInput"
                required
              />
              <Form.Button
                  fluid
                  color="green"
                  size="large"
                  type="submit"
                  onClick={() => {
                    updateUsername(document.getElementById("usernameInput").value);
                  }}
                >
                  <Icon name="pencil" /> Valider
                </Form.Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
      )}
      {username && (
      <Grid color="black" textAlign="center" style={{ height: "90vh" }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: "30em" }}>
          <Header as="h1" textAlign="center">
            Rejoindre une partie
          </Header>
          <Segment stacked>
            <Form size="large">
              <Form.Input
                name="Code de la partie"
                placeholder="Code de la partie"
                autoComplete="off"
                id="roomCodeInput"
                required={selectedAction === "join"}
              />
              <Form.Group widths="equal" style={{ marginBottom: 0 }}>
              <Form.Button
                  inverted
                  fluid
                  color="green"
                  size="large"
                  type="submit"
                  onClick={() => {
                    setSelectedAction("create");
                    createRoomNavigate();
                  }}
                >
                  <Icon name="plus" /> Créer
                </Form.Button>
                <Form.Button
                  fluid
                  color="green"
                  size="large"
                  type="submit"
                  onClick={() => {
                    setSelectedAction("join");
                    joinRoomNavigate(document.getElementById("roomCodeInput").value);

                  }}
                >
                  <Icon name="group" /> Rejoindre
                </Form.Button>
                
              </Form.Group>
            </Form>
            <Modal
              trigger={<Form.Button style={{marginTop:"10px"}} fluid color="blue" size="large" onClick={() => {listRooms(); handleModalOpen();}}>
                <Icon name="list layout"/>Liste des salles</Form.Button>}
              open={modalOpen}
              onClose={handleModalClose}
            >
              <Modal.Header>Liste des salles</Modal.Header>
              <Modal.Content>
                <List>
                  {allRooms.map((room) => (
                    <div style = {{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
                    <List.Item key={room.room}>User: {room.users}</List.Item>
                    <Form.Button
                    color="green"
                    type="submit"
                    onClick={() => {
                      setSelectedAction("join");
                      joinRoomNavigate(room.room);
                    }}>Join</Form.Button>
                    </div>
                  ))}
                </List>
              </Modal.Content>
            </Modal>
          </Segment>
          <Segment>
            <Form.Button fluid color="green" size="large" type="submit" onClick={soloNavigate}>
              <Icon name="user" /> Solo
            </Form.Button>
          </Segment>
        </Grid.Column>
      </Grid>
      )}

    </div>
  );
}
