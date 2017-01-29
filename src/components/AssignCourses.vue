<template>
  <div>

    <p v-if="courses.length === 0" class="color-base-lighter-4">Courses coming up...</p>

    <form>
      <div v-for="(course, key) in courses" class="display-flex alignItems-center margin-bottom-2-1">
        <toggle-checkmark
          small
          class="margin-right-2-1"
          :click="
            user.courses && !user.courses[key] ?
              assignDataToData.bind(this, currentUser.uid, 'users', key, 'courses', true) :
              unassignDataFromData.bind(this, currentUser.uid, 'users', key, 'courses', true)"
          :checked="user.courses ? user.courses[key] : null" />
        <p class="fontSize-large">{{ course.name }}</p>
      </div>
    </form>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ToggleCheckmark from 'components/ToggleCheckmark'
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
      databaseRef: Object,
      user: Object,
      courses: Object
    },
    mixins: [assignDataToData, unassignDataFromData]
  }
</script>

<style></style>
