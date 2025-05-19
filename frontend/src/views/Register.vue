<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const handleRegister = async () => {
  console.log('name:', name.value);
  console.log('Email:', email.value);
  console.log('Password:', password.value);
  const req = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
  });

  if (req.ok) {
    const json = await req.json();
    alert('registered successfully now login!');
    await router.push('/');
    console.log(req, ' req client');
    console.log(json, ' req client json');
    name.value = '';
    email.value = '';
    password.value = '';
  }

  // Здесь можно добавить отправку данных на сервер
};
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 class="text-3xl font-semibold text-center text-gray-800">Create account</h2>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-gray-600 mb-1" for="email">Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label class="block text-gray-600 mb-1" for="email">Email</label>
          <input
            v-model="email"
            type="text"
            id="email"
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
          Register account
        </button>
      </form>
      <p class="text-center text-sm text-gray-500">
        Have an account?
        <RouterLink to="/" class="text-blue-500 hover:underline"> Log in</RouterLink>
      </p>
    </div>
  </div>
</template>
<style scoped>
/* Дополнительные стили при желании */
</style>
