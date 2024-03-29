import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import firebase from 'firebase'
import { fireInit } from './auth/fireInit'

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  mode: 'history' // TODO: Remember to set up the server to ALWAYS serve the index.html file when this history-mode is on (to avoid hashes in the url)
})

// Check if route requires authentication
router.beforeEach( (to, from, next) => {
  if (to.meta.auth && !authenticated) {
    next({ path: 'auth.html' })
  } else {
    next()
  }
})

window.addEventListener('load', function () {
  fireInit(fireStatus)
})

let authenticated = false

function fireStatus(loggedIn, user) {
  if (loggedIn) {

    authenticated = true

    const Quasi = Vue.extend({
      components: { 'app': App },
      data () {
        return {
          authenticated: authenticated,
          currentUser: user,
          database: firebase.database()
        }
      },
      template: '<app :database="database" :currentUser="currentUser" :authenticated="authenticated" />'
    })

    new Vue({
      el: '#app',
      router,
      render: h => h(Quasi)
    })

    const timestamp = new Date().getTime()
    window.Intercom( 'boot', {
      app_id: "igx39wnq",
      name: user.displayName,
      email: user.email,
      created_at: timestamp
    })

    // Script for Fullstory
    FS.identify(user.uid, {
      displayName: user.displayName,
      email: user.email
    });

  } else {
  	authenticated = false
    window.location.href = '/auth.html'
  }
}
