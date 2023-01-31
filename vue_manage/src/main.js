import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import VueRouter from 'vue-router'
import store from '../src/store/index.js'
import axios from 'axios'
import '../api/mock.js'
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(Antd);
Vue.prototype.$axios=axios
import router from './router/index.js'
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
