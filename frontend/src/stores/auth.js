import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const userName = ref('');
  const userEmail = ref('');
  const token = ref('');

  const storedUser = localStorage.getItem('authUser');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    isAuthenticated.value = true;
    userName.value = parsed.name;
    userEmail.value = parsed.email;
    token.value = parsed.token;
  }

  const setUser = (name, email, jwtToken) => {
    isAuthenticated.value = true;
    userName.value = name;
    userEmail.value = email;
    token.value = jwtToken;

    localStorage.setItem('authUser', JSON.stringify({ name, email, token: jwtToken }));
  };

  const logout = () => {
    isAuthenticated.value = false;
    userName.value = '';
    userEmail.value = '';
    token.value = '';
    localStorage.removeItem('authUser');
  };

  return {
    isAuthenticated,
    userName,
    userEmail,
    token,
    setUser,
    logout,
  };
});
