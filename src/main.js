import Vue from 'vue'
import App from './App'

import { store } from 'store/store'

import VueRouter from 'vue-router'
import { routes } from './routes'
Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: 'history' // Remember to set up the server to ALWAYS serve the index.html file when this history-mode is on (to avoid hashes in the url)
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
