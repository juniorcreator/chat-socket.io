<script setup>
defineProps(['chatUsers', 'socket']);
</script>

<template>
  <aside class="hidden lg:block lg:w-1/4 bg-white p-4 border-l border-gray-200">
    <h4 class="text-lg font-semibold text-gray-800 mb-4">Users online</h4>
    <ul class="space-y-3">
      <li
        v-for="user in chatUsers"
        :class="{ 'bg-blue-500/40 rounded-lg': socket?.id === user.id }"
        class="flex items-center space-x-3"
      >
        <img src="" class="w-8 h-8 rounded-full" alt="User Avatar" />
        <span class="text-gray-700 text-sm">{{ user.name }}</span>
      </li>
    </ul>
  </aside>
</template>
<style scoped></style>
