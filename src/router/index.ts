import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Définition des routes avec lazy loading
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login/Login.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../components/signup/Signup.vue')
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../components/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de navigation pour protéger les routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Vérifier si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Vérifier si l'utilisateur est connecté
    if (!authStore.isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router