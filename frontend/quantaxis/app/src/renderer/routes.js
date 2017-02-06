export default [
  {
    path: '/',
    name: 'homePage',
    component: require('components/HomePage')
  },
  {
    path: '/start',
    name: 'startPage',
    component: require('components/Start')
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
