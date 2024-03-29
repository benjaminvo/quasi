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

        <h2 class="subtitle">Add course</h2>
        <form v-on:submit.prevent="addData('name', 'courses', course)">
          <input class="margin-right-2-1" v-model="course.name" type="text" placeholder="Name">
          <label for="weekday">Weekday</label>
          <select class="margin-right-2-1 width-full" name="weekday" v-model="course.weekday">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
          </select>
          <button type="submit" class="margin-top-2-1">Add course</button>
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
        <form v-on:submit.prevent="assignDataToData(assignUserToCourse.userId, 'users', assignUserToCourse.courseId, 'courses')">
          <label for="user">User ID:</label>
          <select class="margin-right-2-1" name="user" v-model="assignUserToCourse.userId">
            <option v-for="(user, index) in users" :value="user.id">{{ user.firstName }} {{ user.lastName }}</option>
          </select>
          <label for="course">Course ID:</label>
          <select class="margin-right-2-1" name="course" v-model="assignUserToCourse.courseId">
            <option v-for="(course, index) in courses" :value="course.id">{{ course.name }}</option>
          </select>
          <button type="submit">Assign user</button>
        </form>
      </div>
    </grid-block>

    <hr>

    <grid-block columns="12">
      <div class="span-12">
        <h1 class="margin-bottom">Articles</h1>
        <ul class="list-unstyled" v-for="(article, index) in articles">
          <li>
            <b>{{ article.title }}</b> ({{ article.year }}), {{ article.author }}, {{ article.id }}
            <span class="delete" @click="deleteArticle(article.id)">Delete</span>
          </li>
        </ul>

        <h2 class="subtitle">Add article</h2>
        <form v-on:submit.prevent="addData('title', 'articles', article)">

          <input v-model="article.title" type="text" placeholder="Title">
          <input v-model="article.author" type="text" placeholder="Author">
          <input v-model.number="article.year" type="text" placeholder="Year">
          <input v-model="article.journal" type="text" placeholder="Journal">
          <input v-model="article.book" type="text" placeholder="Book">
          <input v-model.number="article.chapter" type="text" placeholder="Chapter (number)">
          <input v-model="article.part" type="text" placeholder="Book part (e.g. 'Part 2')">
          <input v-model="article.publisher" type="text" placeholder="Publisher">
          <input v-model.number="article.pageFrom" type="text" placeholder="Page from">
          <input v-model.number="article.pageTo" type="text" placeholder="Page to">
          <input v-model.number="article.citedBy" type="text" placeholder="Cited by (number)">

          <h4 class="margin-top-2-1 margin-bottom">Guide</h4>
          <div class="display-flex">
            <div class="flex-1">
              <h6 class="margin-bottom">About</h6>
              <textarea v-model="article.guide.about" type="text" placeholder="Text"></textarea>
            </div>
            <div class="margin-left-2-1 flex-1">
              <h6 class="margin-bottom">Keep eye on</h6>
              <textarea v-model="article.guide.keepEyeOn" type="text" placeholder="Text"></textarea>
            </div>
          </div>

          <h4 class="margin-top-2-1 margin-bottom">Table of contents</h4>
          <input v-model="article.tableOfContents.chapter01" type="text" placeholder="Chapter 1">
          <input v-model="article.tableOfContents.chapter02" type="text" placeholder="Chapter 2">
          <input v-model="article.tableOfContents.chapter03" type="text" placeholder="Chapter 3">
          <input v-model="article.tableOfContents.chapter04" type="text" placeholder="Chapter 4">
          <input v-model="article.tableOfContents.chapter05" type="text" placeholder="Chapter 5">
          <input v-model="article.tableOfContents.chapter06" type="text" placeholder="Chapter 6">
          <input v-model="article.tableOfContents.chapter07" type="text" placeholder="Chapter 7">
          <input v-model="article.tableOfContents.chapter08" type="text" placeholder="Chapter 8">
          <input v-model="article.tableOfContents.chapter09" type="text" placeholder="Chapter 9">
          <input v-model="article.tableOfContents.chapter10" type="text" placeholder="Chapter 10">

          <button type="submit" class="margin-top-2-1">Add article</button>

        </form>

        <h4 class="subtitle">Assign article to course</h4>
        <form v-on:submit.prevent="assignDataToData(assignArticleToCourse.articleId, 'articles', assignArticleToCourse.courseId, 'courses')">
          <label for="article">Article ID:</label>
          <select class="margin-right-2-1" style="width: 200px;" name="article" v-model="assignArticleToCourse.articleId">
            <option v-for="(article, index) in articles" :value="article.id">{{ article.title }} ({{ article.author }})</option>
          </select>
          <label for="course">Course ID:</label>
          <select class="margin-right-2-1" name="course" v-model="assignArticleToCourse.courseId">
            <option v-for="(course, index) in courses" :value="course.id">{{ course.name }}</option>
          </select>
          <button type="submit">Assign article</button>
        </form>
      </div>
    </grid-block>

    <hr>

    <grid-block columns="12">
      <div class="span-12">
        <h1 class="margin-bottom">Concepts</h1>
        <ul class="list-unstyled" v-for="(concept, index) in concepts">
          <li>{{ concept.name }}</li>
        </ul>

        <h2 class="subtitle">Add concept</h2>
        <form v-on:submit.prevent="addData('name', 'concepts', concept)">
          <input v-model="concept.name" type="text" placeholder="Name">
          <input v-model="concept.description" type="text" placeholder="Description">
          <input v-model="concept.wikiLink" type="text" placeholder="Wiki link">
          <button type="submit" class="margin-top-2-1">Add concept</button>
        </form>

        <h4 class="subtitle">Assign concept to article</h4>
        <form v-on:submit.prevent="assignDataToData(assignConceptToArticle.conceptId, 'concepts', assignConceptToArticle.articleId, 'articles')">
          <label for="article">Concept ID:</label>
          <select class="margin-right-2-1" name="concept" v-model="assignConceptToArticle.conceptId">
            <option v-for="(concept, index) in concepts" :value="concept.id">{{ concept.name }}</option>
          </select>
          <label for="course">Article ID:</label>
          <select class="margin-right-2-1" style="width: 200px;" name="article" v-model="assignConceptToArticle.articleId">
            <option v-for="(article, index) in articles" :value="article.id">{{ article.title }} ({{ article.author }})</option>
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
  import { addData } from 'utils/addData'
  import { assignDataToData } from 'utils/assignDataToData'
  export default {
    name: 'AddRoute',
    components: {
      'grid-block': GridBlock,
    },
    props: {
      databaseRef: { type: Object },
    },
    mixins: [fetchDataToArray, addData, assignDataToData],
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
          book: null,
          chapter: null,
          part: null,
          publisher: null,
          pageFrom: null,
          pageTo: null,
          citedBy: null,
          reactions: {
            easyRead: {
              symbol: 'emoji_easy-read',
              emoji: '&#128526;',
              name: 'Easy read',
              type: 'characteristic'
            },
            interesting: {
              symbol: 'emoji_interesting',
              emoji: '&#129300;',
              name: 'Interesting',
              type: 'characteristic'
            },
            understandable: {
              symbol: 'emoji_understandable',
              emoji: '&#128519;',
              name: 'Understandable',
              type: 'characteristic'
            },
          },
          guide: {
            about: null,
            keepEyeOn: null
          },
          tableOfContents: {
            chapter01: null,
            chapter02: null,
            chapter03: null,
            chapter04: null,
            chapter05: null,
            chapter06: null,
            chapter07: null,
            chapter08: null,
            chapter09: null,
            chapter10: null
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
      deleteCourse(id) {
        if ( confirm('Are you sure?') ) {
          // Delete from courses ref
          this.databaseRef.ref('courses/' + id).remove()
          // Delete it from all articles in which the course is referenced
          this.databaseRef.ref('articles').on('value', (snapshot) => {
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
      deleteArticle(id) {
        if ( confirm('Are you sure?') ) {
          // Delete from articles ref
          this.databaseRef.ref('articles/' + id).remove()
          // Delete it from all courses in which the article is referenced
          this.databaseRef.ref('courses').on('value', (snapshot) => {
            const courseObjs = snapshot.val()
            for (let courseObj in courseObjs) {
              for (let articleId in courseObjs[courseObj].articles) {
                if ( articleId === id ) {
                  this.databaseRef.ref('courses/' + courseObj + '/articles/' + articleId ).remove()
                }
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';

  .addPage {
    background-color: $color-light;
    padding-bottom: $scale-4-1;

    h1, h2, h3, h4, h5, h6, p, li { font-family: $fontFamily-sans; }
    h1, h2, h3, h4, h5, h6 { font-weight: bold; }

    input, textarea { background: white; display: block; margin-bottom: $scale; width: 100%; }

    button { background: $color-primary; padding: $scale-1-2 $scale; }
  }

  .subtitle { margin: $scale-4-1 0 $scale; }

  .delete {
    color: red;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }

</style>
