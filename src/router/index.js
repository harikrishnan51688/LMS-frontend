import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/ebooks',
      name: 'ebooks',
      component: () => import('../views/EbookView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/RegisterPage.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/components/SearchPage.vue')
    },
    {
      path: '/book/:id',
      name: 'book',
      props: true,
      component: () => import('@/components/SingleBookPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/components/ProfilePage.vue')
    },
  ]
})

export default router
