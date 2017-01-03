<template>
  <div>

    <grid-block columns="12">
      <h1 class="span-12 fontFamily-body">Dit overblik</h1>
    </grid-block>

    <day-block
      :currentUser="currentUser"
      v-on:toggleArticleFinished="toggleArticleFinished"
      v-for="(dayBlock, key, index) in dayBlocks"
      :day="key"
      :courses="dayBlock.courses" />

    <modal
      v-if="modalVisible"
      v-on:close="modalVisible = false"
      :currentUser="currentUser"
      :databaseRef="databaseRef"
      :clickedArticleId="clickedArticleId" />

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import DayBlock from 'components/DayBlock'
  import Modal from 'components/Modal'
  export default {
    components: {
      'grid-block': GridBlock,
      'day-block': DayBlock,
      'modal': Modal
    },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
    },
    data() {
      return {
        modalVisible: false,
        clickedArticleId: null,
        dayBlocks: {},
        userFullName: this.currentUser.displayName,
        userFirstName: this.currentUser.displayName.split(' ')[0],
        userLastName: this.currentUser.displayName.substr(this.currentUser.displayName.indexOf(' ') + 1)
      }
    },
    created() {
      this.fetchRelevantArticlesPerCourse()
      this.setUserNameOnDatabase()
    },
    methods: {
      setUserNameOnDatabase() {
        this.databaseRef.ref('users/').once('value', (snapshot) => {
          const users = snapshot.val()
          for (let user in users) {
            if (user === this.currentUser.uid) {
              this.databaseRef.ref('users/' + user + '/firstName').set(this.userFirstName)
              this.databaseRef.ref('users/' + user + '/lastName').set(this.userLastName)
            }
          }
        })
      },
      fetchRelevantArticlesPerCourse() {

        let dayBlocks = {
          Mandag: { courses: [] },
          Tirsdag: { courses: [] },
          Onsdag: { courses: [] },
          Torsdag: { courses: [] },
          Fredag: { courses: [] }
        }

        // Checking if user has got the couse and adding a course object with name of course + articles if so
        this.databaseRef.ref('courses/').on('value', (snapshot) => {
          const courses = snapshot.val()
          for (let course in courses) { // For each course
            const courseHasGotStudents = courses[course].students // If there is students
            if (courseHasGotStudents) {
              if (courses[course].students[this.currentUser.uid]) { // If this user is assigned to course
                const courseObj = {
                  course: courses[course].name,
                  articles: courses[course].articles
                }
                switch(courses[course].weekday) { // Add courseObj to dayBlocks object based on the day of the course
                  case 'Monday': { dayBlocks.Mandag.courses.push(courseObj); break; }
                  case 'Tuesday': { dayBlocks.Tirsdag.courses.push(courseObj); break; }
                  case 'Wednesday': { dayBlocks.Onsdag.courses.push(courseObj); break; }
                  case 'Thursday': { dayBlocks.Torsdag.courses.push(courseObj); break; }
                  case 'Friday': { dayBlocks.Fredag.courses.push(courseObj); break; }
                }
              }
            }
          }
        })

        // Swapping the article id placeholder out with actual article object in dayBlocks object created above
        this.databaseRef.ref('articles/').on('value', (snapshot) => {
          const articleObjs = snapshot.val()
          for (let dayBlock in dayBlocks) { // Loop through the newly created dayBlocks object
            for (let i = 0; i < dayBlocks[dayBlock].courses.length; i++) { // For length of the courses array under each day in dayBlocks
              for (let article in dayBlocks[dayBlock].courses[i].articles) { // And each articleId in each articles array in each course
                for (let articleObj in articleObjs) { // The articleObj fetched from database to compare with the articleId
                  if (articleObj == article) { // If objectObj and articleId in the dayBlocks object matches
                    dayBlocks[dayBlock].courses[i].articles[article] = articleObjs[articleObj] // Set the id to holde the full article object (instead of just 'true')
                  }
                }
              }
            }
          }
        })

        this.dayBlocks = dayBlocks;

      },
      toggleArticleFinished(e) {
        this.clickedArticleId = e.currentTarget.parentNode.id
        const articleFinishedByPath = 'articles/' + this.clickedArticleId + '/finishedBy/'
        const articleFinishedPath = 'users/' + this.currentUser.uid + '/articles/' + this.clickedArticleId + '/finished'
        this.databaseRef.ref(articleFinishedPath).once('value', (snapshot) => {
          const data = snapshot.val()
          if (data === false || data === null) {
            this.databaseRef.ref(articleFinishedPath).set(true)
            this.databaseRef.ref(articleFinishedByPath + '/' + this.currentUser.uid).set(true)
            this.modalVisible = true
          } else if (data === true) {
            this.databaseRef.ref(articleFinishedPath).set(false)
            this.databaseRef.ref(articleFinishedByPath + '/' + this.currentUser.uid).set(false)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
</style>
