import Message from '../models/Message.js';
import Room from '../models/Room.js';

let chatUsers = [];

export default function chatSocket(io) {
  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);
    socket.on('user-connected', async (user) => {
      const rooms = await Room.find();
      if (!chatUsers.find(u => u.email === user.email)) {
        chatUsers.push({ ...user, socketId: socket.id });
      } else {
        // update socketId
        chatUsers = chatUsers.map(u => {
          return user.email === u.email?   { ...u, id: socket.id,  socketId: socket.id, connected: true } : u;
        });
      }
      io.emit('user-connected', user, chatUsers, rooms);
      console.log(chatUsers, ' chatUsers');
      console.log('👥 Users:', chatUsers.map(u => u.name).join(', '));
    });

    socket.on('user-update', (user) => {
      chatUsers = chatUsers.map(item =>
        item.email === user.email ? { ...item, name: user.name } : item
      );
      io.emit('user-updated', chatUsers);
    });

    // private message
    socket.on("private message", async ({ text, toEmail, userEmail, sender }) => {
      const message = new Message({
        sender,
        userEmail,
        toEmail,
        text,
        read: false,
        type: 'private',
      });

      await message.save();

      const toUser = chatUsers.find((u) => u.email === toEmail);
      if (toUser) {
        console.log(toUser, '  toUser');
        socket.to(toUser.socketId).emit("private message", message);
        io.to(toUser.socketId).emit("new-private-message-alert", { fromEmail: userEmail });
      }
      socket.emit("private message", message); // отправляем себе тоже
    });

    socket.on('load-private-messages', async ({ userEmail1, userEmail2 }, callback) => {
      console.log('load-private-messages server');
      const messages = await Message.find({
        $or: [
          { userEmail: userEmail1, toEmail: userEmail2 },
          { userEmail: userEmail2, toEmail: userEmail1 },
        ],
        type: 'private'
      }).sort({ timestamp: 1 });
      console.log(messages, ' messages');

      callback(messages);
    });
    socket.on('mark-messages-read', async ({ fromEmail, toEmail }) => {
      await Message.updateMany(
        { userEmail: fromEmail, toEmail, read: false },
        { $set: { read: true } }
      );
    });

    // rooms
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

    socket.on('join-room', async ({ room, user }) => {
      socket.join(room);
      const history = await Message.find({ room, type: 'room' })
        .sort({ timestamp: 1 })
        .limit(100);
      socket.emit('chat-history', history);
    });

    socket.on('typing', ({ room, user }) => {
      socket.to(room).emit('user-typing', { user, id: socket.id });
    });

    // message in rooms
    socket.on('send-message', async ({ room, user, text, userEmail }) => {
      const message = new Message({
        room,
        sender: user,
        text,
        userEmail,
        type: 'room',
      });
      await message.save();
      console.log('send-message server ', message);

      io.to(room).emit('new-message', message, socket.id);
      io.to(room).emit('stop-typing', { userId: socket.id });
    });


    // disconnect
    socket.on('disconnect', () => {
      chatUsers = chatUsers.map(user => {
        return user.id === socket.id ? {...user, connected: false} : { ...user };
      });
      console.log(chatUsers, ' chatUsers disconnect');
        io.emit('user-disconnected', chatUsers, socket.id);
      console.log('❌ Disconnected:', socket.id);
    });
  });
}
