<template>
  <div class="position-relative">

    <div v-bind:class="{ shown: allRead }" id="particles"></div>

    <grid-block columns="12">
      <h1 class="dashboard_message span-8 offset-2 margin-bottom-4-1" v-html="this.renderMotivationMessage()" /> <!-- Height = 3 lines of text -->
    </grid-block>

    <notification-ticker
      :currentUser="currentUser"
      :notifications="notifications" />

    <day-block
      :currentUser="currentUser"
      :toggleArticleFinished="toggleArticleFinished"
      v-for="(dayBlock, key, index) in dayBlocks"
      :day="key"
      :courses="dayBlock.courses"
      :numOfUsers="numOfUsers" />

    <modal
      v-if="modalVisible"
      v-on:close="closeModal"
      :currentUser="currentUser"
      :databaseRef="databaseRef"
      :articleId="clickedArticleId" />

  </div>
</template>

<script>
  import Particles from 'particles.js'
  import GridBlock from 'components/GridBlock'
  import DayBlock from 'components/DayBlock'
  import Modal from 'components/Modal'
  import NotificationTicker from 'components/NotificationTicker'
  export default {
    name: 'DashboardRoute',
    components: {
      'grid-block': GridBlock,
      'day-block': DayBlock,
      'modal': Modal,
      'notification-ticker': NotificationTicker
    },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object }
    },
    data() {
      return {
        modalVisible: false,
        clickedArticleId: null,
        articles: {},
        users: {},
        dayBlocks: {},
        coursesFetched: false,
        uniqueArticles: [],
        articleDuplicates: 0,
        totalPages: 0,
        userFullName: this.currentUser.displayName,
        notifications: [],
        notificationsRefetchInterval: null
      }
    },
    computed: {
      userFirstName() { return this.currentUser.displayName.split(' ')[0] },
      userLastName() { return this.currentUser.displayName.substr(this.currentUser.displayName.indexOf(' ') + 1) },
      numOfUsers() {
        let usersArray = []
        for ( let user in this.users ) usersArray.push(user)
        return usersArray.length
      },
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
      },
      numOfReadArticles() {
        let numOfReadArticles = 0
        this.databaseRef.ref('users/' + this.currentUser.uid + '/articles').on('value', (snapshot) => {
          const articles = snapshot.val()
          for (let article in articles) {
            if ( articles[article].finished === true ) numOfReadArticles += 1
          }
        })
        return numOfReadArticles
      },
      allRead() {
        if ( this.numOfReadArticles !== 0 ) return this.numOfArticles - this.numOfReadArticles === 0
      }
    },
    created() {
      window.Intercom( 'update' )
    },
    mounted() {
      this.fetchCoursesAndCreateDayblocks()
      this.setUserNameOnDatabase()
      this.particlesInit()
      this.fetchNotifications()
    },
    beforeDestroy() {
      this.databaseRef.ref('users/').off()
      this.databaseRef.ref('courses/').off()
      this.databaseRef.ref('articles/').off()
      clearTimeout(this.notificationsRefetchInterval)
    },
    watch: {
      uniqueArticles: 'getTotalPages',
      coursesFetched: 'fetchRelevantArticlesPerCourse'
    },
    methods: {
      setUserNameOnDatabase() {
        this.databaseRef.ref('users/').once('value', (snapshot) => {
          this.users = snapshot.val()
          for (let user in this.users) {
            if (user === this.currentUser.uid) {
              this.databaseRef.ref('users/' + user + '/firstName').set(this.userFirstName)
              this.databaseRef.ref('users/' + user + '/lastName').set(this.userLastName)
            }
          }
        })
      },
      renderMotivationMessage() {
        const initialMessage = `This week features ${ this.numOfArticles } ${ this.articleDuplicates ? 'unique' : '' } article${(this.numOfArticles > 1) ? 's' : '' } with a total of ${ this.totalPages } pages. Enjoy!`

        if ( this.numOfArticles !== 0 ) {
          switch(this.numOfArticles - this.numOfReadArticles) {
            case 0:
              return "You've finished! &#127881;"
              break
            case 1:
              return '1 to go!'
              break
            default:
              return initialMessage
          }
        }
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
          this.articles = articleObjs
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
      fetchNotifications() {
        this.databaseRef.ref('notifications').limitToLast(20).on('value', (snapshot) => {
          let notificationsArray = []
          const notifications = snapshot.val()
          for ( let notification in notifications) notificationsArray.unshift(notifications[notification])
          this.notifications = notificationsArray
        })
        this.notificationsRefetchInterval = setTimeout(this.fetchNotifications, 30000) // Refetch every half minute to update 'X minutes ago'
      },
      closeModal() {
        this.modalVisible = false
        this.fetchRelevantArticlesPerCourse()
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
        this.clickedArticleId = e.currentTarget.parentNode.parentNode.id
        const articleFinishedByPath = 'articles/' + this.clickedArticleId + '/finishedBy/'
        const articleFinishedPath = 'users/' + this.currentUser.uid + '/articles/' + this.clickedArticleId + '/finished'

        this.databaseRef.ref(articleFinishedPath).once('value', (snapshot) => {

          const data = snapshot.val()

          if (data === false || data === null || !data) {
            this.databaseRef.ref(articleFinishedPath).set(true)
            this.databaseRef.ref(articleFinishedByPath + '/' + this.currentUser.uid).set(true)
            this.modalVisible = true

            // Add notification about finished article to notifications node on database
            this.databaseRef.ref('articles/' + this.clickedArticleId).once('value', (snapshot) => {
              const notification = {
                type: 'articleFinished',
                timestamp: new Date().getTime(),
                article: {
                  id: this.clickedArticleId,
                  title: snapshot.val().meta.title
                },
                user: {
                  id: this.currentUser.uid,
                  name: this.currentUser.displayName
                }
              }
              this.databaseRef.ref('notifications').push(notification)
            })

          } else if (data === true) {

            this.databaseRef.ref(articleFinishedPath).set(false)
            this.databaseRef.ref(articleFinishedByPath + '/' + this.currentUser.uid).set(false)

          }
        })
        this.fetchRelevantArticlesPerCourse()
      },
      particlesInit() {
        particlesJS("particles", {
          "particles": {
            "number": {
              "value": 60
            },
            "shape": {
              "type": "circle"
            },
            "size": {
              "value": 6,
              "random": true
            },
            "line_linked": {
              "enable": false
            },
            "color": {
              "value": "#2962FF"
            },
            "opacity": {
              "value": 1,
              "random": true,
              "anim": {
                "enable": false,
                "opacity_min": 0.2
              }
            },
            "move": {
              "enable": true,
              "speed": .5,
              "direction": "bottom",
              "straight": false
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": false
              }
            },
            "modes": {
              "push": {
                "particles_nb": 12
              }
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">

  @import '~styles/global';

  .dashboard {
    &_message {
      min-height: 194px;
      @include breakpoint( 'tablet' ) { min-height: 108px; }
      @include breakpoint( 'mobile' ) { min-height: 81px; }
    }
  }

  #particles {
    height: 100vh;
    position: absolute;
    left: 0;
    right: 0;
    top: -96px;
    z-index: -1;
    opacity: 0;
    transition: opacity 400ms ease;
  }

</style>
