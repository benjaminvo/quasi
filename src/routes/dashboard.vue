<template>
  <div>

    <div v-if="!dataLoaded" class="hidden fadeInWithDelay">
      <grid-block>
        <h1 class="color-base-lighter-4">Dashboard on its way!</h1>
      </grid-block>
    </div>

    <div class="position-relative hidden" :class="{ fadeIn: dataLoaded }">

      <div v-bind:class="{ shown: allRead }" id="particles"></div>

      <grid-block columns="12">
        <h1 class="dashboard_message span-8 offset-2 margin-bottom-8-1" v-html="motivationMessage" />
      </grid-block>

      <notification-ticker
        :currentUser="currentUser"
        :user="user"
        :notifications="notificationsArray" />

      <day-block
        :currentUser="currentUser"
        :toggleArticleFinished="getArticleDataAndToggleArticleFinished"
        v-for="(dayBlock, key, index) in dayBlocks"
        :day="key"
        :courses="dayBlock.courses" />

      <modal
        opaque
        v-if="modalsVisible.articleFinished"
        v-on:close="modalsVisible.articleFinished = false">
        <article-finished
          v-on:close="modalsVisible.articleFinished = false"
          :currentUser="currentUser"
          :databaseRef="databaseRef"
          :articleId="clickedArticleId" />
      </modal>

      <modal
        opaque
        notDismissable
        v-if="modalsVisible.assignCourses"
        v-on:close="modalsVisible.assignCourses = false"
        class="padding-top-8-1">
        <h1 class="margin-bottom">Hi, {{ userFirstName }}!</h1>
        <h3 class="margin-bottom-4-1">To get started, just pick your courses here</h3>
        <assign-courses
          class="margin-bottom-4-1"
          :currentUser="currentUser"
          :databaseRef="databaseRef"
          :user="user"
          :courses="courses" />
        <button
          class="button submit"
          :class="{ disabled: currentUsersCourseIdsArray.length === 0 }"
          @click="completeInitialAssignCourses">Go to your weekly overview</button>
      </modal>

    </div>

  </div>
</template>

<script>
  import Particles from 'particles.js'
  import { particlesInit } from 'utils/vendor/particlesInit'
  import GridBlock from 'components/GridBlock'
  import DayBlock from 'components/DayBlock'
  import Modal from 'components/Modal'
  import ArticleFinished from 'components/ArticleFinished'
  import { toggleArticleFinished } from 'utils/toggleArticleFinished'
  import AssignCourses from 'components/AssignCourses'
  import NotificationTicker from 'components/NotificationTicker'
  export default {
    name: 'DashboardRoute',
    components: {
      'grid-block': GridBlock,
      'day-block': DayBlock,
      modal: Modal,
      'article-finished': ArticleFinished,
      'assign-courses': AssignCourses,
      'notification-ticker': NotificationTicker
    },
    mixins: [particlesInit, toggleArticleFinished],
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object }
    },
    data() {
      return {
        courses: {},
        articles: {},
        users: {},

        user: {},
        userFullName: this.currentUser.displayName,

        dayBlocks: {},
        totalPages: 0,

        notifications: {},
        notificationsRefetchInterval: null,

        clickedArticleId: null,

        modalsVisible: {
          articleFinished: false,
          assignCourses: false
        },

        dataLoaded: null
      }
    },
    computed: {
      userFirstName() { return this.userFullName.split(' ')[0] },
      userLastName() { return this.userFullName.substr(this.userFullName.indexOf(' ') + 1) },
      currentUsersCourseIdsArray() {
        let currentUsersCourseIdsArray = []
        for ( let courseId in this.user.courses ) if ( this.user.courses[courseId] === true ) currentUsersCourseIdsArray.push( courseId )
        return currentUsersCourseIdsArray
      },
      currentUsersReadArticleIdsArray() {
        let currentUsersReadArticleIdsArray = []
        for ( let articleId in this.user.articlesFinished ) if ( this.user.articlesFinished[articleId] === true ) currentUsersReadArticleIdsArray.push( articleId )
        return currentUsersReadArticleIdsArray
      },
      currentUsersArticlesArray() {
        let currentUsersArticlesArray = []
        for ( let article in this.articles ) {
          for ( let articlesCourseId in this.articles[article].courses ) {
            for ( let usersCourseId in this.user.courses ) {
              if ( this.user.courses[usersCourseId] === true ) {
                if ( articlesCourseId === usersCourseId ) currentUsersArticlesArray.push( this.articles[article] )
        }}}} return currentUsersArticlesArray
      },
      notificationsArray() {
        let notificationsArray = []
        for ( let notification in this.notifications) notificationsArray.unshift( this.notifications[notification] )
        return notificationsArray
      },
      allRead() {
        if ( this.currentUsersReadArticleIdsArray.length !== 0 ) return this.currentUsersArticlesArray.length - this.currentUsersReadArticleIdsArray.length === 0
      },
      motivationMessage() {
        const articlesTotal = this.currentUsersArticlesArray.length
        const articlesFinished = this.currentUsersReadArticleIdsArray.length
        const articlesLeft = articlesTotal - articlesFinished

        switch (true) {
          case (articlesTotal == 0):
            return 'No articles to read this week! You’re off.'
            break
          case (articlesLeft == 0):
            return 'All done! You’ve worked your way through ' + this.totalPages + ' pages. Good job!'
            break
          case (articlesLeft == 1):
            return 'You’re only 1 article from completing this week! So close.'
            break
          case (articlesLeft == 2):
            return 'You’re doing well – and only 2 articles from finishing!'
            break
          case (articlesLeft > 2 && articlesLeft < articlesTotal - 1):
            return 'You’ve finished ' + articlesFinished + ' articles and have ' + articlesLeft + ' more to go.'
            break
          case (articlesLeft == articlesTotal - 1):
            return 'Good start! ' + articlesLeft + ' articles left and still more to learn.'
            break
          case (articlesLeft == articlesTotal):
            return 'This week features ' + articlesTotal + ' articles with a total of ' + this.totalPages + ' pages. Enjoy!'
        }
      }
    },
    created() {
      window.Intercom( 'update' )
    },
    mounted() {
      this.particlesInit()
      this.setUserNameOnDatabase()
      this.databaseRef.ref('users').on('value', (snapshot) => { this.users = snapshot.val() })
      this.databaseRef.ref('courses').on('value', (snapshot) => { this.courses = snapshot.val() })
      this.databaseRef.ref('articles').on('value', (snapshot) => { this.articles = snapshot.val() })
      this.databaseRef.ref('notifications').limitToLast(5).on('value', (snapshot) => { this.notifications = snapshot.val() })
      this.notificationsRefetchInterval = setInterval( this.fetchNotifications, 30000 ) // Refetch every half minute to update 'X minutes ago'
    },
    beforeDestroy() {
      this.databaseRef.ref('users').off()
      this.databaseRef.ref('courses').off()
      this.databaseRef.ref('articles').off()
      clearInterval(this.notificationsRefetchInterval)
    },
    watch: {
      users: 'setUser',
      currentUsersArticlesArray: 'setTotalPages',
      courses: 'createDayblocks',
      dayBlocks: 'fetchArticlesPerCourse',
      articles: 'fetchArticlesPerCourse',
      currentUsersCourseIdsArray: 'decideIfAssignCoursesModalShouldShow'
    },
    methods: {
      setUserNameOnDatabase() {
        this.databaseRef.ref('users/' + this.currentUser.uid + '/firstName').set(this.userFirstName)
        this.databaseRef.ref('users/' + this.currentUser.uid + '/lastName').set(this.userLastName)
      },
      setUser() {
        for ( let user in this.users ) if ( user === this.currentUser.uid ) this.user = this.users[user]
      },
      setTotalPages() {
        if ( this.totalPages === 0 ) {
          let totalPages = 0
          for (let i = 0; i < this.currentUsersArticlesArray.length; i++) {
            const articlePageNum = this.currentUsersArticlesArray[i].pageTo - this.currentUsersArticlesArray[i].pageFrom + 1
            totalPages = totalPages + articlePageNum
          }
          this.totalPages = totalPages
        }
      },
      fetchNotifications() {
        this.databaseRef.ref('notifications').limitToLast(5).once('value', (snapshot) => { this.notifications = snapshot.val() }) // Notice it's .once()
      },
      decideIfAssignCoursesModalShouldShow() {
        if ( this.currentUsersCourseIdsArray.length === 0 ) this.modalsVisible.assignCourses = true // Show course assign modal on load if user has no courses
      },
      completeInitialAssignCourses() {
        this.modalsVisible.assignCourses = false
        window.Intercom( 'trackEvent', 'onboarding_completed' )
        window.Intercom( 'update' ) // Updates Intercom in order to sent onboarding message
      },
      getArticleDataAndToggleArticleFinished(e) {
        this.clickedArticleId = e.currentTarget.parentNode.parentNode.id
        let articleTitle = null
        this.databaseRef.ref('articles/' + this.clickedArticleId).once('value', (snapshot) => { articleTitle = snapshot.val().title })
        this.toggleArticleFinished(this.clickedArticleId, articleTitle, this.currentUser.uid, this.currentUser.displayName, 'articleFinished', this.user.anonymous)
      },
      createDayblocks() {

        let dayBlocks = {
          Monday: { courses: [] },
          Tuesday: { courses: [] },
          Wednesday: { courses: [] },
          Thursday: { courses: [] },
          Friday: { courses: [] }
        }

        // Checking if user has got the couse and adding a course object with name of course + articles if so
        for (let course in this.courses) { // For each course
          const courseHasGotStudents = this.courses[course].users // If there is users
          if (courseHasGotStudents) {
            if (this.courses[course].users[this.currentUser.uid]) { // If this user is assigned to course

              const courseObj = {}
              courseObj['course'] = this.courses[course].name
              courseObj['articles'] = this.courses[course].articles
              courseObj['users'] = this.courses[course].users

              switch( this.courses[course].weekday ) { // Add courseObj to dayBlocks object based on the day of the course
                case 'Monday': { dayBlocks.Monday.courses.push(courseObj); break; }
                case 'Tuesday': { dayBlocks.Tuesday.courses.push(courseObj); break; }
                case 'Wednesday': { dayBlocks.Wednesday.courses.push(courseObj); break; }
                case 'Thursday': { dayBlocks.Thursday.courses.push(courseObj); break; }
                case 'Friday': { dayBlocks.Friday.courses.push(courseObj); break; }

        }}}} this.dayBlocks = dayBlocks
      },
      fetchArticlesPerCourse() { // Swapping the article id placeholder out with actual article object in dayBlocks object created above
        for (let dayBlock in this.dayBlocks) { // Loop through the newly created this.dayBlocks object
          for (let i = 0; i < this.dayBlocks[dayBlock].courses.length; i++) { // For length of the courses array under each day in this.dayBlocks
            for (let dayblockArticleId in this.dayBlocks[dayBlock].courses[i].articles) { // And each articleId in each articles array in each course
              for (let articleId in this.articles) { // The articleId of article fetched from database in mounted() to compare with the articleId
                if (articleId === dayblockArticleId) { // If articleId and dayblockArticleId in the this.dayBlocks object matches
                  this.dayBlocks[dayBlock].courses[i].articles[dayblockArticleId] = this.articles[articleId] // Set the id to holde the full article object (instead of just 'true')
        }}}}}
        this.dataLoaded = true
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/breakpoints';

  #particles {
    height: 100vh;
    position: absolute;
    left: 0;
    right: 0;
    top: -96px;
    z-index: -1;
    opacity: 0;
    transition: opacity 400ms ease;
    pointer-events: none;
  }

</style>
