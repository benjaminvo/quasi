<template>
  <div class="settings">

    <grid-block columns="12">

      <div class="span-12 height-full display-flex flexDirection-column alignItems-center justifyContent-center">

        <h1 class="margin-bottom-4-1">Your courses</h1>

        <assign-courses
          class="margin-bottom-4-1"
          :currentUser="currentUser"
          :databaseRef="databaseRef"
          :user="user"
          :courses="courses" />

        <router-link
          :class="{ disabled: currentUsersCourseIdsArray.length === 0 }"
          :to="{ name: 'dashboard' }"
          tag="button"
          class="button submit fadeIn">Go to weekly overview</router-link>


        <div class="display-flex alignItems-center justifyContent-center margin-top-6-1 padding-top-4-1 border-top border-lightGrey" style="width: 50%;">
          <input type="checkbox" id="hideName" v-model="userAnonymous" v-on:change="toggleAnonymous" />
          <label class="margin-left-2-1" for="hideName">Hide my name in notifications</label>
        </div>

      </div>

    </grid-block>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import AssignCourses from 'components/AssignCourses'
  export default {
    name: 'SettingsRoute',
    components: {
      'grid-block': GridBlock,
      'assign-courses': AssignCourses
    },
    props: {
      currentUser: Object,
      databaseRef: Object
    },
    data() {
      return {
        user: {},
        userAnonymous: null,
        courses: {}
      }
    },
    computed: {
      userFirstName() { return this.currentUser.displayName.split(' ')[0] },
      currentUsersCourseIdsArray() {
        let selectedCourses = []
        for ( let course in this.user.courses ) if ( this.user.courses[course] === true ) selectedCourses.push( course )
        return selectedCourses
      }
    },
    mounted() {
      this.databaseRef.ref( 'users/' + this.currentUser.uid ).on( 'value', (snapshot) => {
        const user = snapshot.val()
        this.user = user
        this.userAnonymous = user.anonymous ? user.anonymous : null
      })
      this.databaseRef.ref( 'courses' ).on( 'value', (snapshot) => { this.courses = snapshot.val() })
    },
    beforeDestroy() {
      this.databaseRef.ref('users').off()
      this.databaseRef.ref('courses').off()
    },
    methods: {
      toggleAnonymous() {
        this.databaseRef.ref('users/' + this.currentUser.uid + '/anonymous').set(this.userAnonymous)
      }
    }
  }
</script>

<style lang="scss">
  .settings { min-height: calc(100% - (96px + 83px)) } // Header and footer
</style>
