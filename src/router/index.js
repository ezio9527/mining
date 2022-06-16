import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/home/IndexView.vue'
import TestView from '@views/test/IndexView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/test',
    name: 'test',
    component: TestView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
