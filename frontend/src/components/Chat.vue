<script setup>
import { onMounted, ref } from 'vue';
import { useShatStore } from '@/stores/chat.js';
import { useAuthStore } from '@/stores/auth.js';
import { useSocket } from '@/composables/useSocket';
import ChatRooms from '@/components/ChatRooms.vue';
import ActiveUsers from '@/components/ActiveUsers.vue';
import MessageForm from '@/components/MessageForm.vue';
import ChatHeader from '@/components/ChatHeader.vue';
import ChatMessages from '@/components/ChatMessages.vue';

const authStore = useAuthStore();
const chatStore = useShatStore();
const chatMessagesRef = ref(null);
const typingUsers = ref(new Map());
const { socket } = useSocket(authStore, chatStore, typingUsers, chatMessagesRef);

onMounted(() => {
  const storedUser = localStorage.getItem('authUser');
  const parsed = JSON.parse(storedUser);
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(parsed.settings.theme);
});
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <!-- Sidebar (rooms) -->
    <ChatRooms
      :rooms="chatStore.rooms"
      :socket="socket"
      :authStore="authStore"
      :chatStore="chatStore"
    />
    <!-- Chat window -->
    <main class="flex-1 flex flex-col relative">
      <!-- Chat header -->
      <ChatHeader :chatStore="chatStore" :socket="socket" />
      <!-- Messages -->
      <ChatMessages
        :chatStore="chatStore"
        :authStore="authStore"
        :typingUsers="typingUsers"
        ref="chatMessagesRef"
      />
      <!-- Input -->
      <MessageForm
        :socket="socket"
        :chatStore="chatStore"
        :authStore="authStore"
        :typingUsers="typingUsers"
      />
    </main>
    <!-- Active users -->
    <ActiveUsers
      :chatUsers="chatStore.chatUsers"
      :socket="socket"
      :chatStore="chatStore"
      :authStore="authStore"
    />
  </div>
</template>

<style scoped></style>
