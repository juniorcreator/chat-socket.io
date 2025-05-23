<script setup>
import { nextTick } from 'vue';

const props = defineProps(['chatUsers', 'socket', 'chatStore', 'authStore']);
const scrollToBottom = async () => {
  const container = document.getElementById('chat-messages');
  await nextTick(() => {
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

const handleSetActiveUser = (user) => {
  props.chatStore.setRoomIfPrivateMessage(user);

  props.socket.emit(
    'load-private-messages',
    {
      userEmail1: props.authStore.userEmail,
      userEmail2: props.chatStore.privateSelectedUser.email,
    },
    (messages) => {
      props.chatStore.setPrivateMessages(messages);
      scrollToBottom();
      props.socket.emit('mark-messages-read', {
        fromEmail: props.chatStore.privateSelectedUser.email,
        toEmail: props.authStore.userEmail,
      });
    },
  );
};
</script>

<template>
  <aside class="hidden lg:block lg:w-1/4 bg-white p-4 border-l border-gray-200">
    <h4 class="text-lg font-semibold text-gray-800 mb-4">Users online</h4>
    <ul class="space-y-3">
      <li
        v-for="user in chatUsers"
        @click="handleSetActiveUser(user)"
        :class="{ 'bg-blue-500/40': chatStore.privateSelectedUser.id === user.id }"
        class="flex flex-wrap items-center space-x-3 p-2 cursor-pointer rounded-lg hover:bg-blue-500/40"
      >
        <span class="text-gray-700 text-sm relative">
          <span class="pulse-ring-wrapper relative inline-block w-4 h-4 ml-1 font-bold">
            <i
              v-if="user.hasNewMessages"
              class="pi pi-envelope text-[peru] text-sm font-bold z-10 relative"
            ></i>
            <span
              v-if="user.hasNewMessages"
              class="absolute top-0 left-0 w-full h-full rounded-full bg-[peru] opacity-50 animate-pulse-ring z-0"
            ></span>
          </span>
          {{ user.name }}
          <i :class="{ connected: user.connected }" class="icon"></i
          >{{ socket?.id === user.id ? ' (you) ' : '' }}
        </span>
      </li>
    </ul>
  </aside>
</template>
<style scoped>
.icon {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  background-color: #e38968;
  margin-right: 6px;
}

.icon.connected {
  background-color: #86bb71;
}
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

.animate-pulse-ring {
  animation: pulse-ring 1.5s ease-out infinite;
}
</style>
