import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { io } from 'socket.io-client';

export function useSocket(authStore, chatStore, typingUsers, chatMessagesRef) {
  const socket = ref(null);
  const typingTimeouts = new Map();

  const scrollToBottom = async () => {
    await nextTick(() => {
      const container = chatMessagesRef.value?.refContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  };

  onMounted(() => {
    if (authStore.isAuthenticated && authStore.userName) {
      socket.value = io('http://localhost:3000');

      socket.value.on('connect', () => {
        console.log('✅ Socket connected to client:', socket.value.id);

        // say user connected
        socket.value.emit('user-connected', {
          name: authStore.userName,
          email: authStore.userEmail,
          id: socket.value.id,
          connected: true,
          messages: [],
          hasNewMessages: false,
        });
      });

      //new room edit delete room
      socket.value.on('room-created', (rooms) => {
        chatStore.setRooms(rooms);
        console.log(rooms, ' all rooms in room-created');
      });
      socket.value.on('room-deleted', (roomId) => {
        chatStore.removeRoom(roomId);
      });

      //typing
      socket.value.on('user-typing', ({ user, id }) => {
        if (!id || !user) return;

        // add to typingUsers
        typingUsers.value.set(id, user);
        typingUsers.value = new Map(typingUsers.value);

        if (typingTimeouts.has(id)) {
          clearTimeout(typingTimeouts.get(id));
        }

        // start new for 3 sec
        const timeout = setTimeout(() => {
          typingUsers.value.delete(id);
          typingUsers.value = new Map(typingUsers.value);
          typingTimeouts.delete(id);
        }, 3000);

        typingTimeouts.set(id, timeout);
      });
      socket.value.on('stop-typing', ({ userId }) => {
        // Убираем пользователя из typingUsers
        typingUsers.value.delete(userId);
        typingUsers.value = new Map(typingUsers.value);

        // Чистим таймер, если есть
        if (typingTimeouts.has(userId)) {
          clearTimeout(typingTimeouts.get(userId));
          typingTimeouts.delete(userId);
        }
      });

      // messages history
      socket.value.on('chat-history', (history) => {
        console.log('chat-history client event');
        chatStore.updateMessages(history);
        scrollToBottom();
        console.log('📜 Chat history loaded:', history);
      });

      // new msg
      socket.value.on('new-message', (msg, sId) => {
        const newMessage = { ...msg, socketId: sId };
        console.log('✉️ New message:', newMessage);
        chatStore.addMessage(newMessage);
        scrollToBottom();
      });

      // private message
      socket.value.on('private message', (message) => {
        console.log(message, ' message');
        chatStore.addPrivateMessage(message);
        // socket.value.emit('join-room', {
        //   room: message.room, // или _id, если хочешь
        //   user: authStore.userName,
        // });
        scrollToBottom();
      });
      socket.value.on('new-private-message-alert', ({ fromEmail }) => {
        chatStore.markUserHasNewMessages(fromEmail);
      });

      //updating chatUsers
      socket.value.on('user-updated', (chatUsers) => {
        chatStore.updateUsers(chatUsers);
      });

      // Processing connect/disconnect
      socket.value.on('user-connected', (user, chatUsers, rooms) => {
        chatStore.updateUsers(chatUsers);
        chatStore.setRooms(rooms);
        console.log('👤 user connected:', user);
      });

      socket.value.on('user-disconnected', (chatUsers, socketId) => {
        // console.log('🚪 user disconnected:', leftUser);
        typingUsers.value.delete(socketId);
        if (typingTimeouts.has(socketId)) {
          clearTimeout(typingTimeouts.get(socketId));
          typingTimeouts.delete(socketId);
        }
        // chatStore.removeChatUser(socketId);
        chatStore.saveUpdateUsers(socketId);
      });

      socket.value.on('disconnect', () => {
        console.log('🔌 Socket disconnected:', socket.value.id);
      });

      socket.value.on('connect_error', (err) => {
        console.error('❌ Socket error:', err.message);
      });

      socket.value.onAny((event, ...args) => {
        console.log(event, ' event', args, ' args');
      });
    }
  });

  onUnmounted(() => {
    socket.value?.disconnect();
    typingTimeouts.forEach(clearTimeout);
    typingTimeouts.clear();
  });

  return { socket };
}
