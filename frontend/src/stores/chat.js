import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useShatStore = defineStore('chat', () => {
  const chat = ref('');
  const rooms = ref([
    { text: 'room 1', value: 'room1', active: true, id: 1, messages: [] },
    { text: 'room 2', value: 'room2', active: false, id: 2, messages: [] },
    { text: 'room 3', value: 'room3', active: false, id: 3, messages: [] },
  ]);
  const selectedRoom = computed(() => rooms.value.filter((item) => item.active === true)[0].value);

  const setActiveRoom = (selectedValue) => {
    rooms.value = rooms.value.map((room) => ({
      ...room,
      active: room.value === selectedValue,
    }));
  };

  return { chat, rooms, selectedRoom, setActiveRoom };
});
