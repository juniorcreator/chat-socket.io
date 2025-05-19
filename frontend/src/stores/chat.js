import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useShatStore = defineStore('chat', () => {
  const chatUsers = ref([]);
  const rooms = ref([]);
  const currentRoom = ref('general'); // default
  const messages = ref([]);

  const setRooms = (updatedRooms) => {
    rooms.value = updatedRooms;
  };
  const removeRoom = (roomId) => {
    rooms.value = rooms.value.filter((r) => r._id !== roomId);
  };
  const setActiveRoom = (id) => {
    rooms.value = rooms.value.map((room) => {
      return room._id === id ? { ...room, active: true } : { ...room, active: false };
    });
    currentRoom.value = rooms.value.find((room) => room._id === id).value;
    messages.value = [];
  };
  const updateUsers = (users) => {
    chatUsers.value = users;
  };
  const addMessage = (message) => {
    messages.value.push(message);
  };
  const updateMessages = (historyMessages) => {
    messages.value = historyMessages;
  };
  const removeChatUser = (id) => {
    chatUsers.value = chatUsers.value.filter((user) => user.id !== id);
  };

  return {
    chatUsers,
    messages,
    currentRoom,
    rooms,
    addMessage,
    updateUsers,
    removeChatUser,
    setActiveRoom,
    updateMessages,
    setRooms,
    removeRoom,
  };
});
