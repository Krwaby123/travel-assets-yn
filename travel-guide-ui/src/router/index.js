import { createRouter, createWebHistory } from 'vue-router'
import YunnanTravel from '../views/YunnanTravel.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: YunnanTravel
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
