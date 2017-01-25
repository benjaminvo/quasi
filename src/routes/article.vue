<template>
  <div>
    <!-- Article header -->
    <grid-block columns="12">

      <!-- Breadcrumb -->
      <ul class="article_breadcrumb span-12 margin-bottom-2-1 fontFamily-body fontSize-base list-unstyled textTransform-uppercase">
        <router-link :to="{ name: 'dashboard' }" tag="li" class="a fontSize-xsmall">Dashboard</router-link>
        <li class="fontSize-xsmall"><span class="color-brandLight-darker-3">/ article</span></li>
      </ul>

      <!-- Article title -->
      <div class="span-12 margin-bottom-6-1">
        <div class="display-flex alignItems-center">
          <h1 class="margin-right-2-1">{{ article.meta ? article.meta.title : null }}</h1>
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

    </grid-block>

    <div class="backgroundColor-brandLight border-top border--light-grey">
      <grid-block columns="12">

        <!-- Left column -->
        <div class="span-3 color-brandLight-darker-2">

          <h6 class="margin-bottom">Details</h6>
          <ul class="list-unstyled">
            <li v-for="(item, key, index) in article.meta" class="margin-bottom-1-2 fontSize-xsmall">
              <span v-if="key === 'pages'">{{ pagesTotal }} pages ({{ item.from }} - {{ item.to }})</span>
              <span v-else-if="key === 'citedBy'">Cited by {{ item }}</span>
              <span v-else-if="key !== 'title'">{{ item }}</span>
            </li>
          </ul>

          <h6 class="margin-bottom margin-top-3-1">ToC</h6>
          <ul class="list-unstyled">
            <li v-for="(item, key, index) in article.tableOfContents" class="margin-bottom-1-2 fontSize-xsmall">{{ item }}</li>
          </ul>

        </div>

        <!-- Right column -->
        <div class="article_introduction span-9">

          <h2 class="margin-bottom-4-1">Reading guide</h2>
          <ul class="list-unstyled">
            <li v-for="(item, key, index) in article.teacherNotes" v-if="key !== 'concepts'" class="margin-bottom">
              <h4 class="margin-bottom-1-2">{{ item.title }}</h4>
              <p class="margin-bottom-3-1">{{ item.text }}</p>
            </li>
          </ul>

          <h4 class="margin-bottom">Concepts</h4>
          <ul class="list-unstyled">
            <li v-for="(item, index) in articleConcepts" class="margin-bottom-2-1 padding-left border-left border--blue border-3">
              <a :href="item.wikiLink" class="margin-bottom-1-2 h6">{{ item.name }}</a>
              <p class="margin-bottom">{{ item.description }}</p>
            </li>
          </ul>

          <div class="article_introduction-splitter" />

          <h2 class="margin-top-4-1 margin-bottom-2-1">Student thoughts</h2>
          <contribution-block
            :currentUser="currentUser"
            :databaseRef="databaseRef"
            :contributions="readerChallenges"
            type="challenge"
            title="Reactions"
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
  import { fetchDataRelatedToData } from 'utils/fetchDataRelatedToData'
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
    mixins: [fetchDataRelatedToData],
    data() {
      return {
        article: {},
        articleCourses: [],
        articleConcepts: [],
        readerChallenges: []
      }
    },
    computed: {
      pagesTotal() { if ( this.article.meta ) return parseInt(this.article.meta.pages.to, 10) - parseInt(this.article.meta.pages.from, 10) },
    },
    created() {
      window.Intercom( 'update' )
    },
    mounted() {
      this.setArticle()
    },
    beforeDestroy() {
      this.databaseRef.ref('articles').off()
      this.databaseRef.ref('courses').off()
      this.databaseRef.ref('concepts').off()
    },
    watch: {
      '$route': 'setArticle',
      article: 'fetchOtherData'
    },
    methods: {
      setArticle() {
        const activeArticleId = this.$route.params.articleId
        this.databaseRef.ref('articles').on('value', (snapshot) => {
          let articleObj = {}
          const data = snapshot.val()
          for (let article in data) {
            if (article === activeArticleId) articleObj = data[article]
          }
          this.article = articleObj
        })
      },
      fetchOtherData() {
        this.setReaderChallenges()
        this.articleCourses = this.fetchDataRelatedToData('courses', this.article.courses)
        this.articleConcepts = this.fetchDataRelatedToData('concepts', this.article.concepts)
      },
      setReaderChallenges() {
        let readerChallenges = []
        for (let challenge in this.article.readerChallenges) {
          this.article.readerChallenges[challenge].id = challenge
          readerChallenges.push(this.article.readerChallenges[challenge])
        }
        this.readerChallenges = readerChallenges
      }
    }
  }
</script>

<style lang="scss">

  @import '~styles/global';
  @import '~styles/card';

  .article {

    &_breadcrumb {
      & li {
        display: inline-block;
      }
    }

    &_introduction {
      @include card;
      border: 1px solid #f1f1f1;
      margin-top: -$scale-12-1;
      background: white;
      padding: $scale-4-1 !important;
      margin-left: -$scale-2-1;

      @include breakpoint('tablet') {
        margin-top: -$scale-6-1;
        margin-left: 0;
        margin-bottom: $scale-4-1;
        padding: $scale-2-1;
      }

      &-splitter {
        width: calc(100% + #{$scale-8-1});
        margin-left: -$scale-4-1;
        margin-top: $scale-4-1;
        border-bottom: 1px solid $color-brandGrey-lighter-6;
      }
    }

  }

</style>
