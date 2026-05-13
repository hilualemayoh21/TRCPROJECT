import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ForgotPassword from './pages/ForgotPassword.vue'
import PendingApproval from './pages/PendingApproval.vue'
import ResearcherInfo from './pages/ResearcherInfo.vue'
import EmailVerification from './pages/EmailVerification.vue'
import Support from './pages/Support.vue'
import PrivacyPolicy from './pages/PrivacyPolicy.vue'
import TermsOfService from './pages/TermsOfService.vue'

const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/verify-email',
    name: 'EmailVerification',
    component: EmailVerification,
    meta: { layout: 'AuthLayout' }
  },
  {
    path: '/pending-approval',
    name: 'PendingApproval',
    component: PendingApproval,
    meta: { requiresAuth: true }
  },
  {
    path: '/researcher-info',
    name: 'ResearcherInfo',
    component: ResearcherInfo,
    meta: { requiresAuth: true }
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