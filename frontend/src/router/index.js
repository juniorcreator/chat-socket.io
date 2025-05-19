import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Chat from '@/components/Chat.vue';
import { useAuthStore } from '@/stores/auth.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = useAuthStore();
  if (to.name === 'chat' && !store.isAuthenticated) next({ name: 'login' });
  else next();
});

export default router;
