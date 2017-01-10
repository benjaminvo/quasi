<template>
  <div>

    <grid-block columns="12">
      <h1 class="span-8 offset-2 margin-bottom-4-1">This week features {{ numOfArticles }} {{ articleDuplicates ? 'unique' : null }} articles with a total of {{ totalPages }} pages. Enjoy!</h1>
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
    name: 'Dashboard',
    components: {
      'grid-block': GridBlock,
      'day-block': DayBlock,
      'modal': Modal
    },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object }
    },
    data() {
      return {
        modalVisible: false,
        clickedArticleId: null,
        dayBlocks: {},
        coursesFetched: false,
        uniqueArticles: [],
        articleDuplicates: 0,
        totalPages: 0,
        userFullName: this.currentUser.displayName,
        userFirstName: this.currentUser.displayName.split(' ')[0],
        userLastName: this.currentUser.displayName.substr(this.currentUser.displayName.indexOf(' ') + 1)
      }
    },
    computed: {
      numOfArticles() {
        const articleIds = []
        const allArticleIds = []
        for (let day in this.dayBlocks) {
          for (let i = 0; i < this.dayBlocks[day].courses.length; i++) {
            for (let article in this.dayBlocks[day].courses[i].articles) {
              allArticleIds.push(article)
              if (!articleIds.includes(article)) {
                articleIds.push(article)
              }
            }
          }
        }
        this.articleDuplicates = allArticleIds.length - articleIds.length
        return articleIds.length
      }
    },
    mounted() {
      this.fetchCoursesAndCreateDayblocks()
      this.setUserNameOnDatabase()
    },
    beforeDestroy() {
      this.databaseRef.ref('users/').off()
      this.databaseRef.ref('courses/').off()
      this.databaseRef.ref('articles/').off()
    },
    watch: {
      uniqueArticles: 'getTotalPages',
      coursesFetched: 'fetchRelevantArticlesPerCourse'
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
      fetchCoursesAndCreateDayblocks() {

        let dayBlocks = {
          Monday: { courses: [] },
          Tuesday: { courses: [] },
          Wednesday: { courses: [] },
          Thursday: { courses: [] },
          Friday: { courses: [] }
        }

        // Checking if user has got the couse and adding a course object with name of course + articles if so
        this.databaseRef.ref('courses/').once('value', (snapshot) => {
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
                  case 'Monday': { dayBlocks.Monday.courses.push(courseObj); break; }
                  case 'Tuesday': { dayBlocks.Tuesday.courses.push(courseObj); break; }
                  case 'Wednesday': { dayBlocks.Wednesday.courses.push(courseObj); break; }
                  case 'Thursday': { dayBlocks.Thursday.courses.push(courseObj); break; }
                  case 'Friday': { dayBlocks.Friday.courses.push(courseObj); break; }
                }
              }
            }
          }
        })

        this.dayBlocks = dayBlocks
        this.coursesFetched = true
      },
      fetchRelevantArticlesPerCourse() {
        // Swapping the article id placeholder out with actual article object in dayBlocks object created above
        this.databaseRef.ref('articles/').once('value', (snapshot) => {
          const articleObjs = snapshot.val()
          for (let dayBlock in this.dayBlocks) { // Loop through the newly created this.dayBlocks object
            for (let i = 0; i < this.dayBlocks[dayBlock].courses.length; i++) { // For length of the courses array under each day in this.dayBlocks
              for (let article in this.dayBlocks[dayBlock].courses[i].articles) { // And each articleId in each articles array in each course
                for (let articleObj in articleObjs) { // The articleObj fetched from database to compare with the articleId
                  if (articleObj == article) { // If objectObj and articleId in the this.dayBlocks object matches
                    this.dayBlocks[dayBlock].courses[i].articles[article] = articleObjs[articleObj] // Set the id to holde the full article object (instead of just 'true')
                    if (!this.uniqueArticles.includes(articleObjs[articleObj])) {
                      this.uniqueArticles.push(articleObjs[articleObj]) // Push all unique articles to array for eg. fetching their num of pages
                    }
                  }
                }
              }
            }
          }
        })
      },
      getTotalPages() {
        if ( this.totalPages === 0 ) {
          let totalPages = 0
          for (let i = 0; i < this.uniqueArticles.length; i++) {
            const articlePageNum = this.uniqueArticles[i].pageTo - this.uniqueArticles[i].pageFrom
            totalPages = totalPages + articlePageNum
          }
          this.totalPages = totalPages
        }
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
        this.fetchRelevantArticlesPerCourse()
      }
    }
  }
</script>

<style lang="scss">
</style>
