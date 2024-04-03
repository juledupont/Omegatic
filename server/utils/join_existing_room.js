function joinExistingRoom(socket, room, username, allUsers) {
    socket.join(room);
    console.log(`${username} joined room ${room}`);
  
    
    allUsers.push({
    id: socket.id,
    username,
    room
    });
  
    // Send all users in the room to the client
    const roomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', roomUsers);
    socket.emit('chatroom_users', roomUsers);
  }
  
  module.exports = joinExistingRoom;
  
