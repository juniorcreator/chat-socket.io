<script setup>
import EmojiPicker from 'vue3-emoji-picker';
import { useAuthStore } from '@/stores/auth.js';
import { useShatStore } from '@/stores/chat.js';
import { onUnmounted, ref } from 'vue';
import debounce from 'lodash.debounce';
const props = defineProps(['socket', 'chatStore', 'authStore', 'selectedUserId']);

const message = ref('');
const inputRef = ref(null);
const showEmojiPicker = ref(false);
const authStore = useAuthStore();
const chatStore = useShatStore();

function onSelectEmoji(emoji) {
  console.log(emoji);
  message.value = message.value + emoji.i;
  inputRef.value.focus();
}

const emitTyping = debounce(() => {
  props.socket.emit('typing', {
    room: props.chatStore.currentRoom,
    user: props.authStore.userName,
  });
}, 200);

const sendMessage = (text, socket) => {
  if (text.trim() && socket) {
    if (!props.chatStore.isPrivateMessage) {
      socket.emit('send-message', {
        room: props.chatStore.currentRoom,
        user: props.authStore.userName,
        userEmail: props.authStore.userEmail,
        text,
      });
    } else {
      console.log('private sendMessage handles');
      socket.emit('private message', {
        text,
        toEmail: chatStore.privateSelectedUser.email,
        userEmail: authStore.userEmail,
        sender: authStore.userName,
      });
    }

    socket.emit('stop-typing', {
      room: props.chatStore.currentRoom,
      userId: socket.id,
    });
    message.value = '';
    showEmojiPicker.value = false;
  }
};

onUnmounted(() => {
  if (props.socket) {
    props.socket.disconnect();
    console.log('🛑 Socket manually disconnected');
  }
});
</script>

<template>
  <div class="bg-white border-t border-gray-200 p-4">
    <form @submit.prevent="sendMessage(message, socket)" class="flex space-x-2 relative">
      <input
        v-model="message"
        @input="emitTyping"
        type="text"
        ref="inputRef"
        placeholder="Введите сообщение..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <span
        @click="showEmojiPicker = !showEmojiPicker"
        :class="{ 'bg-blue-500 text-white rounded-lg': showEmojiPicker }"
        class="p-2 text-2xl cursor-pointer"
      >
        <i class="pi pi-face-smile"></i>
      </span>
      <EmojiPicker
        v-if="showEmojiPicker"
        :native="true"
        @select="onSelectEmoji"
        @mouseleave="showEmojiPicker = false"
        class="absolute right-0 bottom-15"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
      >
        Отправить
      </button>
    </form>
  </div>
</template>

<style scoped></style>
