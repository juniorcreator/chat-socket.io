<script setup>
defineProps(['chatStore']);
</script>

<template>
  <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <h3 class="text-lg font-semibold text-gray-800">Room is: {{ chatStore.currentRoom }}</h3>
    <span class="text-sm text-gray-500">Онлайн: {{ chatStore.chatUsers.length }}</span>
  </div>
</template>

<style scoped></style>
