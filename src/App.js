import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Home from './components/Home'; 
import GameBoard from './components/GameBoard';

const socket = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('join_room', { username, room });
      setGameStarted(true);
    }
  };

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
                joinRoom={joinRoom}
              />
            }
          />
          <Route
            path='/game/:roomName' // Dynamic route parameter for room name
            element={<GameBoard gameStarted={gameStarted} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
