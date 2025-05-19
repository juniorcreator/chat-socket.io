import Message from '../models/Message.js';
import Room from '../models/Room.js';
import { raw } from 'express';

let chatUsers = [];

export default function chatSocket(io) {
  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('user-connected', async (user) => {
      const exists = chatUsers.find(u => u.id === user.id);
      const rooms = await Room.find();
      if (!exists) {
        chatUsers.push(user);
      }
      io.emit('user-connected', user, chatUsers, rooms);
      console.log('👥 Users:', chatUsers.map(u => u.name).join(', '));
    });

    //create room update rooms
    socket.on('create-room', async (name, userEmail, userName) => {
        const room = new Room({
          name: '#' + name,
          value: name,
          active: false,
          avatar: '',
          lastMessage: '',
          createdBy: userEmail,
          creatorName: userName,
        });
       await room.save();

      const rooms = await Room.find();
      console.log('created by ', userEmail);

      io.emit('room-created', rooms);
    });

    socket.on('delete-room', async (roomId) => {
      try {
        await Room.findByIdAndDelete(roomId);
        io.emit('room-deleted', roomId); // уведомляем всех клиентов
        console.log(`🗑️ Комната удалена: ${roomId}`);
      } catch (err) {
        console.error('Ошибка при удалении комнаты:', err);
        socket.emit('error', 'Не удалось удалить комнату');
      }
    });
    //create room // update rooms

    socket.on('join-room', async ({ room, user }) => {
      socket.join(room);
      console.log(`👤 ${user} joined room: ${room}`);
      const history = await Message.find({ room }).sort({ timestamp: 1 }).limit(100);
      socket.emit('chat-history', history);
    });

    socket.on('typing', ({ room, user }) => {
      socket.to(room).emit('user-typing', { user, id: socket.id });
    });

    socket.on('send-message', async ({ room, user, text, userEmail }) => {
      const message = new Message({ room, sender: user, text, userEmail });
      await message.save();

      io.to(room).emit('new-message', message, socket.id);
      io.to(room).emit('stop-typing', { userId: socket.id });
    });

    socket.on('disconnect', () => {
      const leftUser = chatUsers.find(u => u.id === socket.id);
      chatUsers = chatUsers.filter(u => u.id !== socket.id);
      if (leftUser) {
        io.emit('user-disconnected', leftUser, chatUsers, socket.id);
      }
      console.log('❌ Disconnected:', socket.id);
    });
  });
}
