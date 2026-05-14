import LandingPage from './pages/LandingPage.vue'

export default [
  {
    path: '/home',
    name: 'home',
    component: () => import('./pages/LandingPage.vue'),
    meta: { public: true },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./pages/About.vue'),
    meta: { public: true },
  },
  {
    path: '/get-involved',
    name: 'get-involved',
    component: () => import('./pages/GetInvolved.vue'),
    meta: { public: true },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('./pages/News.vue'),
    meta: { public: true },
  },
]
