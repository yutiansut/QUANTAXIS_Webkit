export default [
  {
    path: '/',
    name: 'homePage',
    component: require('components/HomePage')
  },
   {
    path: '/sign',
    name: 'signPage',
    component: require('components/Sign')
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
