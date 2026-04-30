import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ForgotPassword from './pages/ForgotPassword.vue'
import Support from './pages/Support.vue'
import PrivacyPolicy from './pages/PrivacyPolicy.vue'
import TermsOfService from './pages/TermsOfService.vue'

const authRoutes = [
  {
    path: '/login',
    component: Login,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/register',
    component: Register,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/support',
    component: Support,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/privacy',
    component: PrivacyPolicy,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/terms',
    component: TermsOfService,
    meta: { layout: 'AuthLayout' }
  }
]

export default authRoutes