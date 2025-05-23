<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';

const props = defineProps(['modelValue', 'socket']);
const authStore = useAuthStore();
const emit = defineEmits(['update:modelValue', 'theme-changed']);
const isOpen = ref(props.modelValue);
const user = ref({
  name: authStore.userName,
  settings: JSON.parse(JSON.stringify(authStore.settings)), // deep clone
});
const isChanged = computed(() => {
  return (
    user.value.name !== authStore.userName ||
    JSON.stringify(user.value.settings) !== JSON.stringify(authStore.settings)
  );
});
const selectedTheme = ref(user.value.settings.theme);

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
  },
);
const closePopup = () => {
  isOpen.value = false;
  emit('update:modelValue', false);
};

const updateTheme = async (updatedUser) => {
  const token = localStorage.getItem('authUser')
    ? JSON.parse(localStorage.getItem('authUser')).token
    : '';

  const response = await fetch('http://localhost:3000/user/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ updatedUser }),
  });

  const data = await response.json();
  authStore.updateUser(data.user);
  props.socket.emit('user-update', data.user);
  console.log('🛠 Настройки обновлены:', data);
};

const selectTheme = async (theme) => {
  selectedTheme.value = theme;
  emit('theme-changed', theme);
  await updateTheme(theme);
  closePopup();
};
const selectChanege = (e) => {
  console.log(e.target.value, ' selectChanege');
};

onMounted(() => {
  if (authStore.settings?.theme) {
    document.body.classList.add(authStore.settings?.theme);
  }
  // Можно подгрузить текущую тему из настроек пользователя, если нужно
});
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-stone-300/50 flex items-center justify-center z-50"
    @click.self="closePopup"
  >
    <div class="bg-white rounded-lg p-6 w-100 shadow-lg">
      <div class="flex items-center">
        <div class="mr-2">
          <div class="space-y-3"></div>
        </div>
      </div>
      <div>
        <div>Name: <input v-model="user.name" type="text" name="name" /></div>
        <div>Avatar: {{ user.avatar }}</div>
        <div>
          Theme:
          <select v-model="user.settings.theme" name="theme" id="theme">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      </div>
      <button class="mt-4 cursor-pointer text-gray-500 hover:text-gray-800" @click="closePopup">
        Cancel
      </button>
      <button
        @click="updateTheme(user)"
        v-if="isChanged"
        class="mt-4 ml-2 cursor-pointer rounded px-2 bg-blue-500 text-white"
      >
        Update
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Можно добавить кастомные стили */
</style>
