import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import login from '@/components/login'
import home from '@/components/home_page.vue'
import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'
Vue.use(Router)

export default new Router({
  routes: [
    {path:'/',redirect:'/login'},
    { path: '/login', component: login },
    {path:'/home',component:home},
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
  ]
})
