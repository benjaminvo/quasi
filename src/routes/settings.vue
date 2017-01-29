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
      this.databaseRef.ref( 'users/' + this.currentUser.uid ).on( 'value', (snapshot) => { this.user = snapshot.val() })
      this.databaseRef.ref( 'courses' ).on( 'value', (snapshot) => { this.courses = snapshot.val() })
    },
    beforeDestroy() {
      this.databaseRef.ref('users').off()
      this.databaseRef.ref('courses').off()
    }
  }
</script>

<style lang="scss">

  .settings {
    min-height: calc(100% - (96px + 83px)) // Header and footer
  }

</style>
