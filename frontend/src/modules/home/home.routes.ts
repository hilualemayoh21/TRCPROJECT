import LandingPage from './pages/LandingPage.vue'

export default [
  {
    path: '/home',
    name: 'home',
    component: LandingPage,
    meta: {
      public: true,
    },
  },
]
