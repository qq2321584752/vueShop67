// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入饿了么 ui
import ElementUI from 'element-ui'
// 将 各个组件注册为 中间件(我就愿意这么叫) 因为 已经按需引入 css 了 所以 不需要再去 引入css了
Vue.use(ElementUI)

// 控制台提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
