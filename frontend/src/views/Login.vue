<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  console.log('Email:', email.value);
  console.log('Password:', password.value);
  try {
    const req = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (req.ok) {
      // we may let user go to chat
      console.log(req, ' response ok');
      const json = await req.json();
      // alert('logged successfully!');
      // await router.push('/');
      console.log(req, ' req client');
      console.log(json, ' req client json');
      console.log(json.user.name, ' user name ');
      email.value = '';
      password.value = '';
      authStore.setUser(json.user.name, json.user.email, json.token);
      // store.setUser(json.user.name, json.user.email);
      await router.push('/chat');
    }
  } catch (e) {
    console.error(e);
  }
};
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 class="text-3xl font-semibold text-center text-gray-800">Вход в аккаунт</h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-gray-600 mb-1" for="email">Email</label>
          <input
            v-model="email"
            type="text"
            id="email"
            autocomplete="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-gray-600 mb-1" for="password">Пароль</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition font-medium"
        >
          Войти
        </button>
      </form>

      <p class="text-center text-sm text-gray-500">
        Нет аккаунта?
        <RouterLink to="/register" class="text-blue-500 hover:underline">
          Зарегистрироваться</RouterLink
        >
      </p>
    </div>
  </div>
</template>
<style scoped>
/* Дополнительные стили при желании */
</style>
