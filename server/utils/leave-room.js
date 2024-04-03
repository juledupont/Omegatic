// utils/leave-room.js

function leaveRoom(socketId, roomUsers) {
    const updatedUsers = roomUsers.filter((user) => user.id !== socketId);
    return updatedUsers;
  }
  
  module.exports = leaveRoom;
  