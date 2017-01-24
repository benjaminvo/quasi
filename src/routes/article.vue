<template>
  <div>
    <grid-block columns="12">

      <!-- Breadcrumb -->
      <ul class="article_breadcrumb span-12 padding-bottom-2-1 fontFamily-body fontSize-base list-unstyled">
        <router-link :to="{ name: 'dashboard' }" tag="li" class="a">Dashboard</router-link>
        <li><span class="color-brandLight-darker-3">/ </span> {{ article.author }} ({{ article.year }})</li>
      </ul>

      <!-- Article title -->
      <div class="span-12 padding-bottom-4-1">
        <div class="display-flex alignItems-center">
          <h1 class="margin-right-2-1">{{ article.title }}</h1>
          <toggle-checkmark
            finished
            disabled
            v-if="article.finishedBy ? article.finishedBy[currentUser.uid] : null" />
        </div>
        <p class="color-brandLight-darker-3">{{ 'Read for course' + (this.articleCourses.length > 1 ? 's' : '') }}
          <span v-for="(course, index) in this.articleCourses">
            {{ course.name }} on
            {{ course.weekday + (articleCourses.length > 1 && articleCourses.length !== index + 1 ? ', ' : '') }}</span>
        </p>
      </div>

      <!-- Article information -->

      <!-- Left column -->
      <div class="span-3">

        <!-- Article details -->
        <div class="backgroundColor-brandLight padding-2-1 margin-bottom-2-1">
          <h5 class="padding-bottom">Article details</h5>
          <ul class="list-unstyled">
            <li class="padding-bottom">{{ pagesTotal }} pages ({{ article.pageFrom }}-{{ article.pageTo}})</li>
            <li class="padding-bottom">Cited by {{ article.citeCount }}</li>
            <li class="padding-bottom">{{ article.journal }}</li>
            <li class="padding-none">{{ article.publisher }}</li>
          </ul>
        </div>

        <!-- Article structure -->
        <div>
          <h5 class="padding-bottom">Table of contents</h5>
          <ul class="list-unstyled">
            <li class="padding-bottom">Introduction: bringing the power debates together</li>
            <li class="padding-bottom">The first dimension of power</li>
            <li class="padding-bottom">The second dimension of power</li>
            <li class="padding-bottom">The third dimension of power</li>
            <li class="padding-bottom">Fourth dimension of power</li>
            <li class="padding-none">Conclusion</li>
          </ul>
        </div>

      </div>

      <!-- Right column -->
      <div class="article_meta span-9">

        <h5 class="padding-bottom-2-1">Teacher notes</h5>
        <p class="padding-bottom-4-1">{{ article.readingGuide }}</p>

        <h5 class="padding-bottom-2-1">Keywords</h5>
        <p class="padding-bottom-4-1">{{ article.keywords }}</p>

        <h5 class="padding-bottom-2-1">Abstract</h5>
        <p class="padding-bottom-4-1">{{ article.abstract }}</p>

      </div>

    </grid-block>

    <div class="backgroundColor-brandLight border-top border--light-grey">
      <grid-block columns="12">
        <div class="span-9 offset-3">

          <contribution-block
            :currentUser="currentUser"
            :databaseRef="databaseRef"
            :contributions="readerChallenges"
            type="challenge"
            title="Frustrations"
            articleReaderContributionsPathEndpoint="readerChallenges"
            userContributionsPathEndpoint="challenges"
            inputPlaceholder="What frustrated you about the text, if anything?" />

        </div>
      </grid-block>
    </div>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ContributionBlock from 'components/ContributionBlock'
  import ToggleCheckmark from 'components/ToggleCheckmark'
  export default {
    name: 'ArticleRoute',
    components: {
      'grid-block': GridBlock,
      'contribution-block': ContributionBlock,
      'toggle-checkmark': ToggleCheckmark
    },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
    },
    data() {
      return {
        article: {},
        articleCourseIds: [],
        articleCourses: [],
        readerChallenges: []
      }
    },
    computed: {
      pagesTotal() {
        return parseInt(this.article.pageTo, 10) - parseInt(this.article.pageFrom, 10)
      }
    },
    created() {
      window.Intercom( 'update' )
    },
    mounted() {
      this.setArticle()
      this.fetchCourses()
    },
    beforeDestroy() {
      this.databaseRef.ref('articles/').off()
    },
    watch: {
      '$route': 'setArticle'
    },
    methods: {
      setReaderChallenges() {
        let readerChallenges = []
        for (let challenge in this.article.readerChallenges) {
          this.article.readerChallenges[challenge].id = challenge
          readerChallenges.push(this.article.readerChallenges[challenge])
        }
        this.readerChallenges = readerChallenges
      },
      setArticle() {
        const activeArticleId = this.$route.params.articleId
        this.databaseRef.ref('articles/').on('value', (snapshot) => {
          let articleObj = {}
          const data = snapshot.val()
          for (let article in data) {
            if (article === activeArticleId) {
              articleObj = data[article]
              for (let course in articleObj.courses) {
                this.articleCourseIds.push(course) // Get ids of courses that the article is part of
              }
            }
          }
          this.article = articleObj
          this.setReaderChallenges()
        })
      },
      fetchCourses() {
        this.databaseRef.ref('courses/').once('value', (snapshot) => {
          const courses = snapshot.val()
          for (let course in courses) {
            for (let i = 0; i < this.articleCourseIds.length; i++) {
              if (course === this.articleCourseIds[i]) {
                this.articleCourses.push(courses[course])
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

  .article {

    &_breadcrumb {
      & li {
        display: inline-block;
      }
    }

    &_meta {
      height: 100px;
    }

  }

</style>
