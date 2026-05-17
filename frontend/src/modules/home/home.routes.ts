const LandingPage = () => import('./pages/LandingPage.vue')
const About = () => import('./pages/About.vue')
const GetInvolved = () => import('./pages/GetInvolved.vue')
const News = () => import('./pages/News.vue')
const Events = () => import('./pages/Events.vue')
const ContactUs = () => import('./pages/ContactUs.vue')
const SupportUs = () => import('./pages/SupportUs.vue')
const Faqs = () => import('./pages/Faqs.vue')
const TermsOfUse = () => import('./pages/TermsOfUse.vue')
const PrivacyPolicy = () => import('./pages/PrivacyPolicy.vue')

export default [
  {
    path: '/',
    name: 'home',
    component: LandingPage,
    meta: { public: true, layout: 'MainLayout' },
    beforeEnter: (to, from, next) => {
      const { useAuthStore } = require('@/modules/auth/auth.store')
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        next(auth.getPostLoginRoute())
      } else {
        next()
      }
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/get-involved',
    name: 'get-involved',
    component: GetInvolved,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/news',
    name: 'news',
    component: News,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/events',
    name: 'events',
    component: Events,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/contact-us',
    name: 'contact-us',
    component: ContactUs,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/support-us',
    name: 'support-us',
    component: SupportUs,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/faqs',
    name: 'faqs',
    component: Faqs,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/terms-of-use',
    name: 'terms-of-use',
    component: TermsOfUse,
    meta: { public: true, layout: 'MainLayout' },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicy,
    meta: { public: true, layout: 'MainLayout' },
  },
]
