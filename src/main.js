// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import VueQuillEditor  from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// Vue.use(VueQuillEditor)
// 时间处理包
import moment from 'moment'
// 共享面包屑导航升级 ，引入在都会有的main.js当中
import crumb from './components/share/crumb.vue'
Vue.filter('fromat',(time)=>{
  return moment(time).format('YYYY-MM-DD')
})
// 注册为 全局组件
Vue.component('crumb',crumb)
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 拿到 已经存在的token
  var token = window.sessionStorage.getItem('token')
  // config可以直接访问到 请求头信息 向里边按接口文档的要求
  // 添加一个Authorization属性 里边是 拿到的 token 才可以拿到数据
  config.headers.Authorization = token
  
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
Vue.prototype.$http = axios
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
