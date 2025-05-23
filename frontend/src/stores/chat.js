import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useShatStore = defineStore('chat', () => {
  const chatUsers = ref([]);
  const rooms = ref([]);
  const currentRoom = ref(''); // default
  const isPrivateMessage = ref(false);
  const privateSelectedUser = ref({});
  const messages = ref([]);
  const privateMessages = ref([]); // 'socketId1': [ { content: 'Привет', from: '...', ... } ]

  //rooms
  const setRooms = (updatedRooms) => {
    rooms.value = updatedRooms;
  };
  const updateRoom = (roomId) => {
    rooms.value = rooms.value.map((room) => {
      return room._id === roomId ? { ...room, hasNewMessage: true } : room;
    });
  };
  const removeRoom = (roomId) => {
    rooms.value = rooms.value.filter((r) => r._id !== roomId);
  };
  const setCurrentRoom = (newRoom) => {
    currentRoom.value = newRoom;
  };
  const setActiveRoom = (id) => {
    isPrivateMessage.value = false;
    rooms.value = rooms.value.map((room) => {
      return room._id === id ? { ...room, active: true } : { ...room, active: false };
    });
    currentRoom.value = rooms.value.find((room) => room._id === id).value;
    clearRoomNewMessages(currentRoom.value);
    messages.value = [];
  };
  const setRoomIfPrivateMessage = (user) => {
    isPrivateMessage.value = true;
    privateSelectedUser.value = user;
    // Убираем флажок новых сообщений
    chatUsers.value = chatUsers.value.map((u) =>
      u.email === user.email ? { ...u, hasNewMessages: false } : u,
    );
    console.log(user, ' user in setRoomIfPrivateMessage');
  };
  const markRoomHasNewMessages = (roomValue) => {
    console.log(roomValue, 'markRoomHasNewMessages  roomValue');
    rooms.value = rooms.value.map((r) =>
      r.value === roomValue ? { ...r, hasNewMessages: true } : r,
    );
  };
  const clearRoomNewMessages = (roomValue) => {
    rooms.value = rooms.value.map((r) =>
      r.value === roomValue ? { ...r, hasNewMessages: false } : r,
    );
  };

  // private messages
  const addPrivateMessage = (privateMessage) => {
    const isForCurrentPrivateUser =
      isPrivateMessage.value &&
      (privateMessage.userEmail === privateSelectedUser.value.email ||
        privateMessage.toEmail === privateSelectedUser.value.email);

    if (isForCurrentPrivateUser) {
      messages.value.push(privateMessage);
    } else {
      markUserHasNewMessages(privateMessage.userEmail);
    }
  };
  const setPrivateMessages = (historyPrivateMessages) => {
    console.log(historyPrivateMessages, 'setPrivateMessages messages client');
    messages.value = historyPrivateMessages;
  };

  // chat users
  const updateUsers = (users) => {
    chatUsers.value = users;
  };
  const removeChatUser = (id) => {
    chatUsers.value = chatUsers.value.filter((user) => user.id !== id);
  };
  const saveUpdateUsers = (socketId) => {
    console.log(socketId, 'saveUpdateUsers socketId');
    console.log(chatUsers, 'saveUpdateUsers chatUsers');
    chatUsers.value = chatUsers.value.map((u) => {
      console.log(u.socketId === socketId, ' u.socketId === socketId');
      return u.socketId === socketId ? { ...u, connected: false } : u;
    });
  };

  // messages in rooms
  const addMessage = (message) => {
    console.log('message addMessage', message);
    console.log(currentRoom.value !== message.room, ' currentRoom.value !== message.room');
    if (currentRoom.value !== message.room) {
      markRoomHasNewMessages(message.room);
    } else {
      messages.value.push(message);
    }
  };
  const updateMessages = (historyMessages) => {
    messages.value = historyMessages;
  };
  const markUserHasNewMessages = (fromEmail) => {
    console.log(fromEmail, ' markUserHasNewMessages fromEmail ');
    chatUsers.value = chatUsers.value.map((u) => {
      console.log(
        u.email === fromEmail && privateSelectedUser.value.email !== fromEmail,
        ' u.email === fromEmail && privateSelectedUser.value.email !== fromEmail',
      );
      return u.email === fromEmail && privateSelectedUser.value.email !== fromEmail
        ? { ...u, hasNewMessages: true }
        : u;
    });
  };

  return {
    chatUsers,
    messages,
    currentRoom,
    rooms,
    privateMessages,
    isPrivateMessage,
    privateSelectedUser,
    addPrivateMessage,
    addMessage,
    updateUsers,
    removeChatUser,
    setActiveRoom,
    updateMessages,
    setRooms,
    removeRoom,
    setRoomIfPrivateMessage,
    setCurrentRoom,
    markUserHasNewMessages,
    setPrivateMessages,
    markRoomHasNewMessages,
    clearRoomNewMessages,
    saveUpdateUsers,
    updateRoom,
  };
});
