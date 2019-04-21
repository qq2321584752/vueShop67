import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import login from '@/components/login'
import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'
Vue.use(Router)

export default new Router({
  routes: [
    {path:'/login',component:login},
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
  ]
})
