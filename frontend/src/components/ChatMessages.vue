<script setup>
import { ref, useTemplateRef } from 'vue';
const props = defineProps(['chatStore', 'authStore', 'typingUsers']);

const refContainer = useTemplateRef('refContainer');
const isOwnMessage = (item) => item.userEmail === props.authStore.userEmail;

defineExpose({
  refContainer,
});
</script>

<template>
  <div
    id="chat-messages"
    class="111 flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-135px)] max-md:max-h-[calc(60vh-120px)] relative"
    ref="refContainer"
  >
    <div
      v-for="item in chatStore.messages"
      :key="item._id || item.timestamp"
      class="flex space-x-3"
      :class="{ 'justify-end': isOwnMessage(item), 'items-start': !isOwnMessage(item) }"
    >
      <div>
        <div
          :class="{ 'text-right': isOwnMessage(item) }"
          class="text-sm font-semibold text-gray-800"
        >
          {{ item.sender }}
        </div>
        <div
          :class="[
            'text-sm p-2 rounded-lg shadow-sm mt-1 max-w-xs',
            isOwnMessage(item) ? 'text-white bg-blue-500/80' : 'text-gray-700 bg-white',
          ]"
        >
          {{ item.text }}
        </div>
      </div>
    </div>

    <div
      v-if="typingUsers.size > 0"
      class="text-sm text-white italic z-10 fixed bottom-20 bg-blue-500 rounded-lg px-2"
    >
      {{ Array.from(typingUsers.values()).join(', ') }} typing...
    </div>
  </div>
</template>

<style scoped></style>
