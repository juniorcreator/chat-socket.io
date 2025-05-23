import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const userName = ref('');
  const userEmail = ref('');
  const avatar = ref('');
  const settings = ref({});
  const token = ref('');

  const storedUser = localStorage.getItem('authUser');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    isAuthenticated.value = true;
    userName.value = parsed.name;
    userEmail.value = parsed.email;
    token.value = parsed.token;
    avatar.value = parsed.avatar;
    settings.value = parsed.settings;
  }

  const setUser = (name, email, jwtToken, userDetails = {}) => {
    isAuthenticated.value = true;
    userName.value = name;
    userEmail.value = email;
    token.value = jwtToken;
    avatar.value = userDetails.avatar || '';
    settings.value = userDetails.settings || {};

    localStorage.setItem(
      'authUser',
      JSON.stringify({
        name,
        email,
        token: jwtToken,
        avatar: avatar.value,
        settings: settings.value,
      }),
    );
  };
  const updateUser = (user) => {
    const storedUser = localStorage.getItem('authUser');
    const parsed = JSON.parse(storedUser);
    const updatedUser = { ...parsed, name: user.name, settings: user.settings };
    userName.value = user.name;
    settings.value = user.settings;
    console.log(user, ' user');
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(user.settings.theme);
  };

  const logout = () => {
    isAuthenticated.value = false;
    userName.value = '';
    userEmail.value = '';
    avatar.value = '';
    settings.value = {};
    token.value = '';
    localStorage.removeItem('authUser');
  };

  return {
    isAuthenticated,
    userName,
    userEmail,
    avatar,
    settings,
    token,
    setUser,
    logout,
    updateUser,
  };
});
