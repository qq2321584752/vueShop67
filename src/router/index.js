import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

import login from '@/components/login'
import home from '@/components/home_page.vue'
import users from '@/components/users.vue'
import welcome from '@/components/welcome.vue';
import rights from '@/components/rights.vue'
import roles from '@/components/roles.vue'
import categories from '@/components/categories.vue'
import params from '@/components/param.vue'
import goods from '@/components/goods.vue'
import GoodsAdd from '@/components/GoodsAdd.vue'
import orders from '@/components/orders.vue'
import reports from "@/components/reports.vue";
Vue.use(Router)



const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home', component: home, redirect: '/welcome', children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path:'/categories',component:categories},
        { path: '/params', component: params },
        { path: '/goods', component: goods },
        { path: '/GoodsAdd', component: GoodsAdd},
        { path: '/orders', component: orders},
        { path: '/reports', component: reports}
      ]
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
  ]
})


router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  // null === false
  if (token === null && to.path != '/login') {
    return next('/login')
  }
  next()
})

export default router
