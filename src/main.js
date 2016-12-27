import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import firebase from 'firebase'
import { fireInit } from './auth/fireInit'
import Header from 'components/Header'

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
  mode: 'history' // Remember to set up the server to ALWAYS serve the index.html file when this history-mode is on (to avoid hashes in the url)
})

// Check if route requires authentication
router.beforeEach( (to, from, next) => {
  if (to.meta.auth && !authenticated) {
    console.log('meta');
    next({ path: 'auth.html' })
  } else {
    next()
  }
})

fireInit(fireStatus)
let authenticated = false

function fireStatus(loggedIn, user) {
  if (loggedIn) {

    authenticated = true

    const database = firebase.database()

    const App = Vue.extend({
      data () {
        return {
          authenticated: authenticated,
          currentUser: user,
          database: database
        }
      },
      template:
        '<div v-if="authenticated">' +
          '<app-header :currentUser="currentUser" :authenticated="authenticated"></app-header>' +
          '<router-view :databaseRef="database" :currentUser="currentUser" :authenticated="authenticated"></router-view>' + // <- nested outlet
        '</div>',
        components: {
          'app-header': Header
        },
      // // WARNING! THIS CREATED INFINITE LOOP OF THE USER ID AS A VALUE TO INFINITELY MANU KEYS INSTEAD OF ONE SINGLE KEY.
      // // ASK USERS TO FINISH THEIR PROFILE AS FIRST THING WHEN LOGGING IN AND CREATE THE USER THERE INSTEAD.
      // created() {
      //   // Check if user exists in database on login. If not, create the user with the uid
      //   const currentUserId = user.uid
      //   usersRef.on('value', (snapshot) => {
      //     const data = snapshot.val()
      //     for (let user in data) {
      //       if (currentUserId === user) {
      //         console.log('User is set in database');
      //       } else {
      //         usersRef.push(currentUserId)
      //       }
      //     }
      //   });
      // }
    })

    new Vue({
      el: '#app',
      router,
      render: h => h(App)
    })

  } else {
  	authenticated = false
    window.location.href = 'auth.html'
  }
}
