import { createRouter, createWebHistory } from 'vue-router'
import AdminPanel from '../views/AdminPanel.vue'
import ToiletCard from '../views/ToiletCard.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AdminPanel',
      component: AdminPanel,
    },
    {
      path: '/ToiletCard',
      name: 'ToiletCard',
      component: ToiletCard,
    },

  ],
})

export default router
