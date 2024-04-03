// server/index.js

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const joinExistingRoom = require('./utils/join_existing_room');
const leaveRoom = require('./utils/leave-room');

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://omegatic.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// Store active rooms and their players
const rooms = new Map();
const allUsers = [];

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('create_room', (data) => {
      const { username} = data;
      const room = generateRandomString(6);
      // You may emit an event here to send the room code back to the client, if needed
      socket.emit('room_created', room);
      joinExistingRoom(socket, room, username, allUsers);
      io.emit('room_list', Array.from(rooms.keys()));
    });

    socket.on('join_room', (data) => {
        const { username, room } = data;
    
        // Check if the room exists before allowing a user to join
        console.log(username);
        console.log(room);
        console.log(io.sockets.adapter.rooms);
    
        const roomExists = io.sockets.adapter.rooms.has(room);
    
        if (!roomExists) {
          console.log(`Room ${room} does not exist`); 
          // Emit an event to inform the client that the room doesn't exist
          socket.emit('room_not_found', { room }); 
          return;
        }
    
        // Send the codeof the room to the client
        socket.emit('room_code', room);
    
        joinExistingRoom(socket, room, username, allUsers);
    
        
      });

      socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.emit('room_code', null);
        socket.leave(room);
        // Remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit('chatroom_users', allUsers); // Notify other clients in the room about the updated player list
        console.log(`${username} left room ${room}`);
      });

      socket.on('start_game', (data) => {
        const { room } = data;
        const players = allUsers.filter((user) => user.room === room);
        if (players.length === 2) {
            // Emit an event to start the game
            // i want to send to the two players in the room a different message with their player number
            const player1 = players[0];
            const player2 = players[1];
            io.to(player1.id).emit('game_started', { player: 'X' });
            io.to(player2.id).emit('game_started', { player: 'O' });
        } else {
            console.log('Not enough players to start the game');
        }
    }
    );


      socket.on('update_game_state', (data) => {
        // Broadcast the updated game state to all players in the room
        io.to(data.room).emit('game_state_update', data);
    });

    socket.on('reset_game', (data) => {
        io.to(data.room).emit('game_reset');
    });
});


const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
