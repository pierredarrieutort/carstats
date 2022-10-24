import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/app',
    component: () => import('@/components/MainMenu.vue'),
    children: [
      {
        path: 'navigation',
        component: () => import('@/views/app/NavigationView.vue')
      },
      {
        path: 'statistics',
        component: () => import('@/views/app/StatisticsView.vue')
      },
      {
        path: 'driving',
        component: () => import('@/views/app/DrivingView.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/app/ProfileView.vue')
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'forgot-password',
        component: () => import('@/views/auth/ForgotPasswordView.vue')
      },
      {
        path: 'reset-password',
        component: () => import('@/views/auth/ResetPasswordView.vue')
      },
      {
        path: 'sign-in',
        component: () => import('@/views/auth/SignInView.vue')
      },
      {
        path: 'sign-up',
        component: () => import('@/views/auth/SignUpView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
