<template>
  <div style="min-height: 100vh;">

    <grid-block columns="12">

      <div class="span-12 display-flex flexDirection-column alignItems-center">

        <h1 class="margin-bottom-4-1">Your courses</h1>

        <p v-if="courses.length === 0" class="span-12 color-base-lighter-4">Courses coming up...</p>

        <form class="span-12 margin-bottom-4-1">
          <div v-for="course in courses" class="display-flex alignItems-center margin-bottom-2-1">
            <toggle-checkmark
            small
              class="margin-right-2-1"
              :click="
                user.courses && !user.courses[course.id] ?
                  assignDataToData.bind(this, currentUser.uid, 'users', course.id, 'courses', true) :
                  unassignDataFromData.bind(this, currentUser.uid, 'users', course.id, 'courses', true)"
              :checked="user.courses ? user.courses[course.id] : null" />
            <p class="fontSize-large">{{ course.name }}</p>
          </div>
        </form>

        <div class="span-12">
          <router-link
            :class="{ disabled: selectedCourses.length === 0 }"
            :to="{ name: 'dashboard' }"
            tag="button"
            class="button submit fadeIn">Go to weekly overview</router-link>
        </div>

      </div>

    </grid-block>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ToggleCheckmark from 'components/ToggleCheckmark'
  import { fetchDataToArray } from 'utils/fetchDataToArray'
  import { assignDataToData } from 'utils/assignDataToData'
  import { unassignDataFromData } from 'utils/unassignDataFromData'
  export default {
    name: 'SettingsRoute',
    components: {
      'grid-block': GridBlock,
      'toggle-checkmark': ToggleCheckmark
    },
    props: {
      currentUser: Object,
      databaseRef: Object
    },
    mixins: [fetchDataToArray, assignDataToData, unassignDataFromData],
    data() {
      return {
        courses: [],
        user: {}
      }
    },
    computed: {
      selectedCourses() {
        let selectedCourses = []
        for ( let course in this.user.courses ) {
          if ( this.user.courses[course] === true ) selectedCourses.push( course )
        }
        return selectedCourses
      }
    },
    mounted() {
      this.courses = this.fetchDataToArray('courses', true)
      this.databaseRef.ref( 'users/' + this.currentUser.uid ).on( 'value', (snapshot) => { this.user = snapshot.val() })
    },
    beforeDestroy() {
      this.databaseRef.ref( 'courses' ).off()
      this.databaseRef.ref( 'users' ).off()
    }
  }
</script>

<style lang="scss"></style>
