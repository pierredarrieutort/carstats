import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/app/navigation',
    name: 'navigation',
    component: () => import('../views/app/NavigationView.vue')
  },
  {
    path: '/app/statistics',
    name: 'statistics',
    component: () => import('../views/app/StatisticsView.vue')
  },
  {
    path: '/app/driving',
    name: 'driving',
    component: () => import('../views/app/DrivingView.vue')
  },
  {
    path: '/app/profile',
    name: 'profile',
    component: () => import('../views/app/ProfileView.vue')
  },
  {
    path: '/auth/forgot-password',
    name: 'Forgot Password',
    component: () => import('../views/auth/ForgotPasswordView.vue')
  },
  {
    path: '/auth/reset-password',
    name: 'Reset Password',
    component: () => import('../views/auth/ResetPasswordView.vue')
  },
  {
    path: '/auth/sign-in',
    name: 'Sign in',
    component: () => import('../views/auth/SignInView.vue')
  },
  {
    path: '/auth/sign-up',
    name: 'Sign up',
    component: () => import('../views/auth/SignUpView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
