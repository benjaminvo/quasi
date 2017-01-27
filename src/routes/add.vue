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
          <input v-model="article.pageFrom" type="text" placeholder="Page from">
          <input v-model="article.pageTo" type="text" placeholder="Page to">
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

    <hr>

    <grid-block columns="12">
      <div class="span-12">

        <h4 class="subtitle">Add concept</h4>
        <form v-on:submit.prevent="addConcept">
          <input v-model="concept.name" type="text" placeholder="Name">
          <input v-model="concept.description" type="text" placeholder="Description">
          <input v-model="concept.wikiLink" type="text" placeholder="Wiki link">
          <button type="submit">Add concept</button>
        </form>

        <h4 class="subtitle">Assign concept to article</h4>
        <form v-on:submit.prevent="assignConceptToArticle">
          <label for="article">Concept ID:</label>
          <select class="margin-right-2-1" name="concept" v-model="assignConceptToArticle.conceptId">
            <option v-for="(concept, index) in concepts">{{ concept.id }}</option>
          </select>
          <label for="course">Article ID:</label>
          <select class="margin-right-2-1" name="article" v-model="assignConceptToArticle.articleId">
            <option v-for="(article, index) in articles">{{ article.id }}</option>
          </select>
          <button type="submit">Assign concept</button>
        </form>

      </div>
    </grid-block>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import { fetchDataToArray } from 'utils/fetchDataToArray'
  export default {
    name: 'AddRoute',
    components: {
      'grid-block': GridBlock,
    },
    props: {
      databaseRef: { type: Object },
    },
    mixins: [fetchDataToArray],
    data() {
      return {
        courses: [],
        users: [],
        articles: [],
        concepts: [],
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
          pages: {
            to: null,
            from: null
          }
        },
        concept: {
          name: null,
          description: null,
          wikiLink: null
        },
        assignUserToCourse: {
          userId: null,
          courseId: null
        },
        assignArticleToCourse: {
          articleId: null,
          courseId: null
        },
        assignConceptToArticle: {
          conceptId: null,
          articleId: null
        }
      }
    },
    created() {
      this.courses = this.fetchDataToArray('courses', true)
      this.users = this.fetchDataToArray('users', true)
      this.articles = this.fetchDataToArray('articles', true)
      this.concepts = this.fetchDataToArray('concepts', true)
    },
    methods: {
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
            pages: {
              to: this.article.pageTo,
              from: this.article.pageFrom
            }
          })
          this.article.title = ''
          this.article.author = ''
          this.article.year = ''
          this.article.journal = ''
          this.article.publisher = ''
          this.article.pageFrom = ''
          this.article.pageTo = ''
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
      addConcept() {
        if ( this.concept.name != '' ) {
          this.databaseRef.ref('concepts').push({
            name: this.concept.name,
            description: this.concept.description,
            wikiLink: this.concept.wikiLink
          })
          this.concept.name = ''
          this.concept.description = ''
          this.concept.wikiLink = ''
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
      },
      assignConceptToArticle() {
        if (confirm('Assign ' + this.assignConceptToArticle.conceptId + ' to ' + this.assignConceptToArticle.articleId + '?') ) {
          this.databaseRef.ref('articles/' + this.assignConceptToArticle.articleId + '/concepts/' + this.assignConceptToArticle.conceptId).set(true)
          this.databaseRef.ref('concepts/' + this.assignConceptToArticle.conceptId + '/articles/' + this.assignConceptToArticle.articleId).set(true)
          this.assignConceptToArticle.conceptId = ''
          this.assignConceptToArticle.articleId = ''
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/global';

  .addPage {
    background-color: $color-light;
    padding-bottom: $scale-4-1;

    h1, h2, h3, h4, h5, h6, p, li { font-family: $fontFamily-sans; }
    h1, h2, h3, h4, h5, h6 { font-weight: bold; }

    input, textarea { background: white; display: block; margin-bottom: $scale; width: 100%; }

    button { background: $color-primary; padding: $scale-1-2 $scale; }
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
