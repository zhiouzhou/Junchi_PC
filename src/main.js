// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import store from './assets/data'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import axios from 'axios'
import echarts from 'echarts'
import $ from 'jquery'
import Interceptors from './assets/models/defaultInterceptor'
// axios.interceptors.request.use(Interceptors.requestInterceptor.config, Interceptors.requestInterceptor.error)
axios.interceptors.response.use(Interceptors.responseInterceptor.response, Interceptors.responseInterceptor.error)


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts 
//全局前置守卫
router.beforeEach(function (to, from, next) {
  let hasToken = !!this.app.$options.store.state.user.access_token;
  console.log(hasToken)
  if (to.path === "/login" || to.path === "/resetPassword") {
    next();
  } else if (!hasToken) {
    next({ path: '/login', replace: true, query: { redirect: to.fullPath } });
  } else {
    next();
  }
}.bind(router));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
