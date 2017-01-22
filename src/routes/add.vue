<template>
  <div class="addPage">

    <hr>

    <grid-block columns="12">
      <div class="span-12">
        <h1 class="margin-bottom">Courses</h1>
        <ul class="list-unstyled">
          <li v-for="(course, index) in courses">
            <b>{{ course.name }}</b>,
            <span>{{ course.id }}</span>
            <span class="delete" @click="deleteCourse(course.id)">Delete</span>
          </li>
        </ul>

        <h4 class="subtitle">Add course</h4>
        <form v-on:submit.prevent="addCourse">
          <input class="margin-right-2-1" v-model="course.name" type="text" placeholder="Name">
          <label for="weekday">Weekday:</label>
          <select class="margin-right-2-1" name="weekday" v-model="course.weekday">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
          </select>
          <button type="submit">Add course</button>
        </form>
      </div>
    </grid-block>

    <hr>

    <grid-block columns="12">
      <div class="span-12">
        <h1 class="margin-bottom">Users</h1>
        <ul class="list-unstyled">
          <li v-for="(user, index) in users">
            <b>{{ user.firstName }} {{ user.lastName }}</b>,
            <span>{{ user.id }}</span>
          </li>
        </ul>

        <h4 class="subtitle">Assign user to course</h4>
        <form v-on:submit.prevent="assignUserToCourse">
          <label for="user">User ID:</label>
          <select class="margin-right-2-1" name="user" v-model="assignUserToCourse.userId">
            <option v-for="(user, index) in users">{{ user.id }}</option>
          </select>
          <label for="course">Course ID:</label>
          <select class="margin-right-2-1" name="course" v-model="assignUserToCourse.courseId">
            <option v-for="(course, index) in courses">{{ course.id }}</option>
          </select>
          <button type="submit">Assign user</button>
        </form>
      </div>
    </grid-block>

    <hr>

    <grid-block columns="12">
      <div class="span-12">
        <h1 class="margin-bottom">Articles</h1>
        <ul class="list-unstyled border-bottom" v-for="(article, index) in articles">
          <li>
            <b>{{ article.title }}</b>, {{ article.id }}, {{ article.author }} ({{ article.year }})
            <span class="delete" @click="deleteArticle(article.id)">Delete</span>
          </li>
        </ul>

        <h4 class="subtitle">Add article</h4>
        <form v-on:submit.prevent="addArticle">
          <input v-model="article.title" type="text" placeholder="Title">
          <input v-model="article.author" type="text" placeholder="Author">
          <input v-model="article.year" type="text" placeholder="Year">
          <input v-model="article.journal" type="text" placeholder="Journal">
          <input v-model="article.publisher" type="text" placeholder="Publisher">
          <input v-model="article.keywords" type="text" placeholder="Keywords (Ex: Cognition, psychology, ...)">
          <input v-model="article.pageFrom" type="text" placeholder="Page from">
          <input v-model="article.pageTo" type="text" placeholder="Page to">
          <textarea v-model="article.abstract" placeholder="Abstract"></textarea>
          <button type="submit">Add article</button>
        </form>

        <h4 class="subtitle">Assign article to course</h4>
        <form v-on:submit.prevent="assignArticleToCourse">
          <label for="article">Article ID:</label>
          <select class="margin-right-2-1" name="article" v-model="assignArticleToCourse.articleId">
            <option v-for="(article, index) in articles">{{ article.id }}</option>
          </select>
          <label for="course">Course ID:</label>
          <select class="margin-right-2-1" name="course" v-model="assignArticleToCourse.courseId">
            <option v-for="(course, index) in courses">{{ course.id }}</option>
          </select>
          <button type="submit">Assign article</button>
        </form>
      </div>
    </grid-block>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  export default {
    name: 'AddRoute',
    components: {
      'grid-block': GridBlock,
    },
    props: {
      databaseRef: { type: Object },
    },
    data() {
      return {
        courses: [],
        users: [],
        articles: [],
        course: {
          name: null,
          weekday: null
        },
        article: {
          title: null,
          author: null,
          year: null,
          journal: null,
          publisher: null,
          keywords: null,
          pageFrom: null,
          pageTo: null,
          abstract: null
        },
        assignUserToCourse: {
          userId: null,
          courseId: null
        },
        assignArticleToCourse: {
          articleId: null,
          courseId: null
        }
      }
    },
    created() {
      this.fetchCourses()
      this.fetchUsers()
      this.fetchArticles()
    },
    methods: {
      fetchCourses() {
        this.databaseRef.ref('courses/').on('value', (snapshot) => {
          let coursesArray = []
          const courses = snapshot.val()
          for (let course in courses) {
            const courseObj = courses[course]
            courseObj.id = course
            coursesArray.push(courseObj)
          }
          this.courses = coursesArray
        })
      },
      fetchUsers() {
        this.databaseRef.ref('users/').on('value', (snapshot) => {
          let usersArray = []
          const users = snapshot.val()
          for (let user in users) {
            const userObj = users[user]
            userObj.id = user
            usersArray.push(userObj)
          }
          this.users = usersArray
        })
      },
      fetchArticles() {
        this.databaseRef.ref('articles/').on('value', (snapshot) => {
          let articlesArray = []
          const articles = snapshot.val()
          for (let article in articles) {
            const articleObj = articles[article]
            articleObj.id = article
            articlesArray.push(articleObj)
          }
          this.articles = articlesArray
        })
      },
      addCourse() {
        if ( this.course.name != '' ) {
          this.databaseRef.ref('courses/').push({
            name: this.course.name,
            weekday: this.course.weekday
          })
          this.course.name = ''
          this.course.weekday = ''
        }
      },
      deleteCourse(id) {
        if ( confirm('Are you sure?') ) {
          // Delete from courses ref
          this.databaseRef.ref('courses/' + id).remove()
          // Delete it from all articles in which the course is referenced
          this.databaseRef.ref('articles/').on('value', (snapshot) => {
            const articleObjs = snapshot.val()
            for (let articleObj in articleObjs) {
              for (let courseId in articleObjs[articleObj].courses) {
                if ( courseId === id ) {
                  this.databaseRef.ref('articles/' + articleObj + '/courses/' + courseId ).remove()
                }
              }
            }
          }),
          // Delete it from all users in which the course is referenced
          this.databaseRef.ref('users/').on('value', (snapshot) => {
            const userObjs = snapshot.val()
            for (let userObj in userObjs) {
              for (let courseId in userObjs[userObj].courses) {
                if ( courseId === id ) {
                  this.databaseRef.ref('users/' + userObj + '/courses/' + courseId ).remove()
                }
              }
            }
          })
        }
      },
      addArticle() {
        if ( this.article.title != '' ) {
          this.databaseRef.ref('articles/').push({
            title: this.article.title,
            author: this.article.author,
            year: this.article.year,
            journal: this.article.journal,
            publisher: this.article.publisher,
            keywords: this.article.keywords,
            pageFrom: this.article.pageFrom,
            pageTo: this.article.pageTo,
            abstract: this.article.abstract
          })
          this.article.title = ''
          this.article.author = ''
          this.article.year = ''
          this.article.journal = ''
          this.article.publisher = ''
          this.article.keywords = ''
          this.article.pageFrom = ''
          this.article.pageTo = ''
          this.article.abstract = ''
        }
      },
      deleteArticle(id) {
        if ( confirm('Are you sure?') ) {
          // Delete from articles ref
          this.databaseRef.ref('articles/' + id).remove()
          // Delete it from all courses in which the article is referenced
          this.databaseRef.ref('courses/').on('value', (snapshot) => {
            const courseObjs = snapshot.val()
            for (let courseObj in courseObjs) {
              for (let articleId in courseObjs[courseObj].articles) {
                if ( articleId === id ) {
                  this.databaseRef.ref('courses/' + courseObj + '/articles/' + articleId ).remove()
                }
              }
            }
          }),
          // Delete it from all users in which the article is referenced
          this.databaseRef.ref('users/').on('value', (snapshot) => {
            const userObjs = snapshot.val()
            for (let userObj in userObjs) {
              for (let articleId in userObjs[userObj].articles) {
                if ( articleId === id ) {
                  this.databaseRef.ref('users/' + userObj + '/articles/' + articleId ).remove()
                }
              }
            }
          })
        }
      },
      assignUserToCourse() {
        if (confirm('Assign ' + this.assignUserToCourse.userId + ' to ' + this.assignUserToCourse.courseId + '?') ) {
          this.databaseRef.ref('courses/' + this.assignUserToCourse.courseId + '/students/' + this.assignUserToCourse.userId).set(true)
          this.databaseRef.ref('users/' + this.assignUserToCourse.userId + '/courses/' + this.assignUserToCourse.courseId).set(true)
          this.assignUserToCourse.userId = ''
          this.assignUserToCourse.courseId = ''
        }
      },
      assignArticleToCourse() {
        if (confirm('Assign ' + this.assignArticleToCourse.articleId + ' to ' + this.assignArticleToCourse.courseId + '?') ) {
          this.databaseRef.ref('courses/' + this.assignArticleToCourse.courseId + '/articles/' + this.assignArticleToCourse.articleId).set(true)
          this.databaseRef.ref('articles/' + this.assignArticleToCourse.articleId + '/courses/' + this.assignArticleToCourse.courseId).set(true)
          this.assignArticleToCourse.articleId = ''
          this.assignArticleToCourse.courseId = ''
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/global';

  .addPage {
    background-color: $color-brandLight;
    padding-bottom: $scale-4-1;

    h1, h2, h3, h4, h5, h6, p, li { font-family: $fontFamily-sans; }
    h1, h2, h3, h4, h5, h6 { font-weight: bold; }

    input, textarea { background: white; display: block; margin-bottom: $scale; width: 100%; }

    button { background: $color-brandFirst; padding: $scale-1-2 $scale; }
  }

  .subtitle { margin: $scale-3-1 0 $scale; }

  .delete {
    color: red;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }

</style>
