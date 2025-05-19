<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps(['rooms', 'socket', 'authStore', 'chatStore']);

const router = useRouter();
const roomCreation = ref({ creating: false, saved: false });
const roomName = ref('');

const joinRoom = (roomName) => {
  console.log(roomName, ' joinRoom function');
  props.socket.emit('join-room', {
    room: roomName,
    user: props.authStore.userName,
  });
};
const handleSetActiveRoom = (roomId) => {
  props.chatStore.setActiveRoom(roomId);
  joinRoom(props.chatStore.currentRoom);
  console.log('handleSetActiveRoom');
};
const handleCreateRoom = (avatar) => {
  if (!roomName.value.trim()) return;
  console.log('submited handleCreateRoom');
  props.socket.emit(
    'create-room',
    roomName.value,
    props.authStore.userEmail,
    props.authStore.userName,
  );
  roomName.value = '';
};
const handleDeleteRoom = (id) => {
  props.socket.emit('delete-room', id, props.authStore.userEmail);
};
const handleLogOut = () => {
  props.authStore.logout();
  router.push('/');
};
</script>

<template>
  <aside class="md:w-1/4 w-full bg-white p-4 border-r border-gray-200 space-y-4">
    <div class="flex flex-wrap justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Rooms</h2>
      <button
        @click="roomCreation.creating = !roomCreation.creating"
        class="text-blue-500 p-2 hover:text-blue-700 transition cursor-pointer"
        title="Создать комнату"
      >
        <i v-if="!roomCreation.creating" class="pi pi-plus font-bold text-xl"></i>
        <i v-else class="pi pi-minus font-bold text-xl"></i>
      </button>
      <form
        @submit.prevent="handleCreateRoom"
        v-if="roomCreation.creating"
        action=""
        class="bg-gray-100 p-2 max-w-full rounded-lg"
      >
        <input
          class="w-full rounded-lg border-1 border-gray-300 px-2 py-1 mb-1"
          placeholder="room name"
          type="text"
          name="name"
          v-model="roomName"
        />
        <input
          class="w-35 rounded-lg border-1 border-gray-300 p-1 mb-1 mr-3"
          type="file"
          name="avatar"
        />
        <button
          class="cursor-pointer bg-blue-500 text-white px-2 py-1 rounded-xl hover:bg-blue-600 transition"
          type="submit"
        >
          Create
        </button>
        <button
          type="button"
          @click="roomCreation.creating = false"
          class="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-2 py-1 ml-1 rounded-xl transition"
        >
          Cansel
        </button>
      </form>
    </div>
    <ul class="space-y-2">
      <li
        v-for="room in rooms"
        :key="room._id"
        @click="handleSetActiveRoom(room._id)"
        :class="{ 'bg-blue-50 font-medium text-blue-700': room.active }"
        class="cursor-pointer p-2 rounded-lg hover:bg-blue-100 transition"
      >
        {{ room.name }}
        <button
          v-if="room.createdBy === authStore.userEmail"
          @click="handleDeleteRoom(room._id)"
          class="cursor-pointer ml-1 p-1 text-red-500 hover:scale-120 transition"
        >
          <i class="pi pi-trash"></i>
        </button>
        <div class="text-[10px] text-stone-500">created by: {{ room.creatorName }}</div>
      </li>
    </ul>
    <button
      @click="handleLogOut"
      class="mt-6 w-full cursor-pointer bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition font-medium"
    >
      Выйти
    </button>
  </aside>
</template>

<style scoped></style>
