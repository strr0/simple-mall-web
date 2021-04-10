import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from './utils/apiUtil'
import { initMenu } from './utils/menuUtil'

Vue.use(ElementUI)

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if(to.path == '/') {
    next()
  }
  else {
    if(store.state.user) {
      initMenu(router, store)
    }
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
