import { createRouter } from 'vue-router'
import App from '@/App.vue'

const routes = [
  {
    path: '/:lobbyCode',
    component: App,
    name: 'App'
  }
]

const router = createRouter({})

export default router
