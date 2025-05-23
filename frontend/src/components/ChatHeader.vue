<script setup>
import SettingsPopup from '@/components/SettingsPopup.vue';
import { ref, computed } from 'vue';
const props = defineProps(['chatStore', 'socket']);

const showSettings = ref(false);
const onlineUsers = computed(
  () => props.chatStore.chatUsers.filter((user) => user.connected).length,
);

const onThemeChanged = (theme) => {
  console.log('Выбрана тема:', theme);
  // request
};
</script>

<template>
  <div>
    <button
      @click="showSettings = !showSettings"
      class="flex items-center rounded p-2 cursor-pointer hover:bg-gray-800 hover:text-white"
    >
      <i class="pi pi-cog mr-2"></i> settings
    </button>
  </div>
  <SettingsPopup
    v-if="showSettings"
    v-model="showSettings"
    @theme-changed="onThemeChanged"
    :socket="socket"
  />

  <br />
  <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <h3 v-if="chatStore.currentRoom" class="text-lg font-semibold text-gray-800">
      Room is: {{ chatStore.currentRoom }}
    </h3>
    <h3 v-else class="text-lg font-semibold text-gray-800">
      Please select a room or private user messaging 😉
    </h3>
    <span class="text-sm text-gray-500"
      >Online: {{ onlineUsers }} of {{ chatStore.chatUsers.length }}</span
    >
  </div>
</template>

<style scoped></style>
