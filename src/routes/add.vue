<template>
  <div class="addPage">

    <hr>

    <grid-block columns="12">
      <div class="span-12">
        <h1>Courses</h1>
        <ul class="list-unstyled">
          <li v-for="(course, index) in courses">
            <b>{{ course.name }}</b>,
            <span>{{ course.id }}</span>
            <span class="delete" @click="deleteThis('courses/', course.id)">Delete</span>
          </li>
        </ul>

        <h3 class="margin-top-4-1">Add course</h3>
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
        <h1>Users</h1>
        <ul class="list-unstyled">
          <li v-for="(user, index) in users">
            <span>{{ user.id }}</span>,
            Status of articles: <b v-for="(article, index) in user.articles">{{ article.finished }} </b>
          </li>
        </ul>
      </div>
    </grid-block>

    <hr>

    <grid-block columns="12">
      <div class="span-12">
        <h1>Articles</h1>
        <ul class="list-unstyled border-bottom" v-for="(article, index) in articles">
          <li><b>{{ article.title }}</b>, {{ article.author }} ({{ article.year }}) <span class="delete" @click="deleteThis('articles/', article.id)">Delete</span></li>
        </ul>

        <h3 class="margin-top-4-1">Add article</h3>
        <form v-on:submit.prevent="addArticle">
          <input class="margin-right-2-1" v-model="article.title" type="text" placeholder="Title">
          <input class="margin-right-2-1" v-model="article.author" type="text" placeholder="Author">
          <input class="margin-right-2-1" v-model="article.year" type="text" placeholder="Year">
          <input class="margin-right-2-1" v-model="article.pageFrom" type="text" placeholder="Page from">
          <input class="margin-right-2-1" v-model="article.pageTo" type="text" placeholder="Page to">
          <button type="submit">Add article</button>
        </form>
      </div>
    </grid-block>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  export default {
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
          pageFrom: null,
          pageTo: null
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
        this.databaseRef.ref('courses/').push({
          name: this.course.name,
          weekday: this.course.weekday
        })
        this.course.name = ''
        this.course.weekday = ''
      },
      addArticle() {
        this.databaseRef.ref('articles/').push({
          title: this.article.title,
          author: this.article.author,
          year: this.article.year,
          pageFrom: this.article.pageFrom,
          pageTo: this.article.pageTo
        })
        this.article.title = ''
        this.article.author = ''
        this.article.year = ''
        this.article.pageFrom = ''
        this.article.pageTo = ''
      },
      deleteThis(databaseRef, id) {
        console.log('test');
        if ( confirm('Are you sure?') ) {
          this.databaseRef.ref(databaseRef + id).remove()
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

    h1, h2, h3, h4, h5, h6, p, li { font-family: $fontFamily-system; }
    h1, h2, h3, h4, h5, h6 { font-weight: bold; }

    button { padding: $scale-1-2 $scale; }
  }

  .delete {
    color: red;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }

</style>
