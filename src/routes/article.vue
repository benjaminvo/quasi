<template>
  <div>

    <div v-if="!dataLoaded" class="hidden fadeInWithDelay margin-top-3-1">
      <grid-block>
        <h1 class="color-base-lighter-4">Article on its way!</h1>
      </grid-block>
    </div>

    <div class="hidden" :class="{ fadeIn: dataLoaded }">

      <div v-bind:class="{ shown: articleFinished }" id="particles"></div>

      <!-- Article header -->
      <grid-block columns="12">

        <div class="span-10 margin-bottom-12-1">
          <!-- Article/chapter title -->
          <h1 class="margin-none-bottom" :style="{ fontSize: titleSize ? titleSize + 'px' : null }">{{ article.title }}</h1>

          <!-- Subtitle: "Chapter number"/"Book part" in "Book title" -->
          <h5 v-if="article.book" class="color-base margin-top-2-1 margin-none-bottom">
            <span v-if="article.chapter">Ch. {{ article.chapter }}</span><span v-else-if="article.part">{{ article.part }}</span> in <i>{{ article.book }}</i>
          </h5>
        </div>

      </grid-block>

      <div class="backgroundColor-light border-top border-lightGrey">
        <grid-block columns="12" class="flexDirection-columnReverse-tablet">

          <!-- Left column -->
          <div class="article_details span-3">

            <div class="display-flex alignItems-center margin-bottom-7-1 margin-none-tablet">
              <toggle-checkmark
                class="margin-right-2-1"
                :click="toggleArticleFinished.bind(this, this.$route.params.articleId, article.title, currentUser.uid, currentUser.displayName, 'articleFinished', this.userAnonymous)"
                :checked="article.finishedBy ? article.finishedBy[currentUser.uid] : null" />
              <p class="display-inlineBlock color-dark" v-for="(course, index) in this.articleCourses">Due {{ course.weekday }}</p>
            </div>

            <h6 class="margin-top-4-1 margin-bottom-2-1 color-base-lighter-2 fontWeight-bold">Details</h6>
            <ul class="list-unstyled color-base-lighter-2">
              <li class="margin-bottom">{{ article.author }} ({{ article.year }})</li>
              <li class="margin-bottom">{{ pagesTotal }} pages ({{ article.pageFrom }}-{{ article.pageTo }})</li>
              <li v-if="article.chapter" class="margin-bottom">Chapter {{ article.chapter }}</li>
              <li v-if="article.citedBy" class="margin-bottom">Cited by {{ article.citedBy }}</li>
            </ul>

            <div v-if="article.tableOfContents">
              <h6 class="margin-top-4-1 margin-bottom-2-1 color-base-lighter-2 fontWeight-bold">Table of Contents</h6>
              <ul class="list-unstyled color-base-lighter-2">
                <li v-for="(item, key, index) in article.tableOfContents" class="margin-bottom">{{ item }}</li>
              </ul>
            </div>

          </div>

          <!-- Right column -->
          <div class="article_introduction offset-1 span-8 card card-2">

            <div class="article_introduction_upper">

              <h2 class="margin-bottom-3-1">Reading guide</h2>

              <div v-for="(item, key, index) in article.guide" class="guide margin-bottom-5-1">
                <h3 class="margin-bottom-2-1" v-if="key === 'keepEyeOn'">Keep an eye on</h3>
                <div v-html="markdown(item)" />
              </div>

              <h3 class="margin-bottom-3-1">Key concepts</h3>
              <ul class="list-unstyled">
                <li v-for="(item, index) in articleConcepts" class="concept">
                  <a :href="item.wikiLink" target="_blank" class="h6 margin-bottom-1-2">{{ item.name }}</a>
                  <p class="margin-bottom">{{ item.description }}</p>
                </li>
              </ul>

            </div>

            <div class="article_introduction_lower">

              <h2 class="display-inlineBlock margin-bottom-3-1">Student thoughts</h2>

              <div class="float-right">
                <div class="display-inlineBlock color-base-lighter-3 margin-left-2-1"
                  v-for="reaction in article.reactions"
                  v-if="reaction.count && reaction.count > 0">
                  <p class="fontSize-xsmall margin-right-1-4 display-inlineBlock">{{ reaction.count }}</p>
                  <img class="display-inlineBlock" style="vertical-align: -2px;" :src="'/dist/' + reaction.symbol + '.svg'" :title="reaction.name" width="20" />
                </div>
              </div>

              <div class="clear-both margin-bottom-2-1"></div>

              <contribution-block
                :currentUser="currentUser"
                :userAnonymous="userAnonymous"
                :databaseRef="databaseRef"
                :contributions="articleContributions"
                :article="article" />

            </div>

          </div>

        </grid-block>
      </div>

      <modal
        opaque
        v-if="modalsVisible.articleFinished"
        v-on:close="modalsVisible.articleFinished = false">
        <article-finished
          v-on:close="modalsVisible.articleFinished = false"
          :currentUser="currentUser"
          :databaseRef="databaseRef"
          :articleId="this.$route.params.articleId" />
      </modal>

    </div>

  </div>
</template>

<script>
  import Particles from 'particles.js'
  import { particlesInit } from 'utils/vendor/particlesInit'
  import GridBlock from 'components/GridBlock'
  import Modal from 'components/Modal'
  import ContributionBlock from 'components/ContributionBlock'
  import ToggleCheckmark from 'components/ToggleCheckmark'
  import ArticleFinished from 'components/ArticleFinished'
  import { toggleArticleFinished } from 'utils/toggleArticleFinished'
  import { fetchDataRelatedToData } from 'utils/fetchDataRelatedToData'
  import marked from 'marked'
  export default {
    name: 'ArticleRoute',
    components: {
      'grid-block': GridBlock,
      modal: Modal,
      'contribution-block': ContributionBlock,
      'toggle-checkmark': ToggleCheckmark,
      'article-finished': ArticleFinished
    },
    mixins: [particlesInit, toggleArticleFinished, fetchDataRelatedToData],
    props: {
      currentUser: Object,
      databaseRef: Object
    },
    data() {
      return {
        article: {},
        articleCourses: [],
        articleConcepts: [],
        articleContributions: {},
        modalsVisible: {
          articleFinished: false,
        },
        dataLoaded: null,
        userAnonymous: null
      }
    },
    computed: {
      pagesTotal() { return parseInt(this.article.pageTo, 10) - parseInt(this.article.pageFrom, 10) + 1 }, // + 1 to include last page
      articleFinished() { return this.article.finishedBy ? this.article.finishedBy[this.currentUser.uid] : null },
      titleSize() {
        const title = this.article ? this.article.title : null
        let titleSize = null
        if ( title ) {
          if ( title.length < 16 ) titleSize = 72
          else if ( title.length < 36 ) titleSize = 48
          else titleSize = 36
        }
        return titleSize
      },
    },
    created() {
      window.Intercom( 'update' )
    },
    mounted() {
      this.particlesInit()
      this.setArticleListener()
      this.setContributionsListener()
      this.setAnonymousState()
    },
    beforeDestroy() {
      this.databaseRef.ref('articles').off()
      this.databaseRef.ref('contributions').off()
    },
    watch: {
      '$route': 'setArticleListener',
      article: 'fetchOtherData'
    },
    methods: {
      setArticleListener() {
        this.databaseRef.ref('articles').on('value', (snapshot) => {
          const data = snapshot.val()
          for ( let article in data ) { if ( article === this.$route.params.articleId ) this.article = data[article] }
        })
      },
      setContributionsListener() {
        this.databaseRef.ref('contributions').orderByChild('article').equalTo(this.$route.params.articleId).on('value', (snapshot) => { this.articleContributions = snapshot.val() })
      },
      setAnonymousState() {
        this.databaseRef.ref('users/' + this.currentUser.uid + '/anonymous').once('value', (snapshot) => { this.userAnonymous = snapshot.val() })
      },
      fetchOtherData() {
        this.articleCourses = this.fetchDataRelatedToData('courses', this.article.courses)
        this.articleConcepts = this.fetchDataRelatedToData('concepts', this.article.concepts)
        this.dataLoaded = true
      },
      markdown(text) { return marked(text) }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';
  @import '~styles/breakpoints';

  .article {

    &_details,
    &_introduction { margin-top: -$scale-13-1; }

    &_details {
      @include breakpoint('tablet') { margin-top: 0; }}

    &_introduction {
      border-top: 1px solid #f1f1f1;
      margin-top: -120px;
      background: white;
      overflow: hidden;
      padding: 0;

      @include breakpoint('tablet') {
        margin-top: -$scale-6-1;
        margin-left: 0;
        margin-bottom: $scale-4-1;
      }

      &_upper {
        padding: $scale-6-1 $scale-8-1 $scale-4-1 !important;

        @include breakpoint('desktop') {
          padding: $scale-4-1 $scale-4-1 $scale-2-1 !important;
        }

        .guide p,
        .guide a {
          font-size: 16px !important;

          @include breakpoint('desktop') {
            font-size: 14px !important;
          }
        }

        .guide p {
          line-height: 1.6;
          margin-bottom: $scale-2-1;

          &:last-child { margin-bottom: 0; }

          @include breakpoint('desktop') {
            line-height: 1.5;
          }
        }
      }

      &_lower {
        padding: $scale-6-1 $scale-8-1 $scale-3-1 !important;
        background: $color-base-lighter-7;
        border-top: 1px solid $color-base-lighter-6;

        @include breakpoint('desktop') {
          padding: $scale-4-1 $scale-4-1 $scale !important;
        }
      }
    }
  }

  .concept {
    margin-bottom: $scale-2-1;
    border-left: 3px solid $color-primary;
    margin-left: -$scale-8-1;
    padding-left: $scale-8-1 - 3px;
  }

</style>
