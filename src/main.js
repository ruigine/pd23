import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router"
import store from './store'

Vue.config.productionTip = false

// Global Variables
Vue.prototype.$prizesRange = [1901, 6000];
Vue.prototype.$vouchersRange = [1901, 6000];

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
