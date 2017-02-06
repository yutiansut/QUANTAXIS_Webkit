export default [
  {
    path: '/',
    name: 'homePage',
    component: require('components/HomePage')
  },
   {
    path: '/todo',
    name: 'todoPage',
    component: require('components/todo')
  },
   {
    path: '/sign',
    name: 'signPage',
    component: require('components/Sign')
  },
   {
    path: '/personal',
    name: 'personal',
    component: require('components/Personal'),
    children:[
      {'path': '/personal/index',component: require('components/Personal/index')},
       {'path': '/personal/notebook',component: require('components/Personal/notebook')}
    ]
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
