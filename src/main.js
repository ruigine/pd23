import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router"
import store from './store'

Vue.config.productionTip = false

// Global Variables
Vue.prototype.$prizesRange = [1901, 2580];
Vue.prototype.$vouchersRange = [2581, 5880];

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
