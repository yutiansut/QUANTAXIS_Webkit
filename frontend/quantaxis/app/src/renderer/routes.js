export default [
  {
    path: '/',
    name: 'home',
    component: require('components/Home')
  },
  {
    path: '/lp',
    name: 'landing-page',
    component: require('components/LandingPageView')
  },
  {
    path: '*',
    redirect: '/'
  }
]
