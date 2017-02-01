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

        <!-- Article title (and subtitle) -->
        <div class="span-12 margin-bottom-12-1">
          <h1 class="margin-none-bottom">{{ article.title }}</h1>
          <h5 v-if="article.book" class="color-base margin-top-2-1 margin-none-bottom">Ch. {{ article.chapter }} in <i>{{ article.book }}</i></h5>
        </div>

      </grid-block>

      <div class="backgroundColor-light border-top border-lightGrey">
        <grid-block columns="12" class="flexDirection-columnReverse-tablet">

          <!-- Left column -->
          <div class="article_details span-3">

            <div class="display-flex alignItems-center margin-top margin-bottom-6-1 margin-none-tablet">
              <toggle-checkmark
                small
                class="margin-right-2-1"
                :click="toggleArticleFinished.bind(this, this.$route.params.articleId, article.title, currentUser.uid, currentUser.displayName, 'articleFinished')"
                :checked="article.finishedBy ? article.finishedBy[currentUser.uid] : null" />
              <p class="display-inlineBlock fontSize-small color-dark" v-for="(course, index) in this.articleCourses">Due {{ course.weekday }}</p>
            </div>

            <h6 class="margin-top-4-1 margin-bottom-2-1 color-base-lighter-2 fontWeight-bold">Details</h6>
            <ul class="list-unstyled color-base-lighter-2">
              <li class="margin-bottom fontSize-small">{{ article.author }} ({{ article.year }})</li>
              <li class="margin-bottom fontSize-small">{{ pagesTotal }} pages ({{ article.pageFrom }}-{{ article.pageTo }})</li>
              <li v-if="article.chapter" class="margin-bottom-1-2 fontSize-small">Chapter {{ article.chapter }}</li>
              <li v-if="article.citedBy" class="margin-bottom-1-2 fontSize-small">Cited by {{ article.citedBy }}</li>
            </ul>

            <h6 class="margin-top-4-1 margin-bottom-2-1 color-base-lighter-2 fontWeight-bold">Table of Contents</h6>
            <ul class="list-unstyled color-base-lighter-2">
              <li v-for="(item, key, index) in article.tableOfContents" class="margin-bottom fontSize-small">{{ item }}</li>
            </ul>

          </div>

          <!-- Right column -->
          <div class="article_introduction span-9 card card-2">

            <h2 class="margin-bottom-4-1">Reading guide</h2>
            <ul class="margin-bottom-8-1 list-unstyled">
              <li v-for="(item, key, index) in article.guide" v-if="key !== 'concepts'" class="margin-bottom">
                <h4 class="margin-bottom-1-2">{{ item.title }}</h4>
                <p class="margin-bottom-3-1">{{ item.text }}</p>
              </li>
            </ul>

            <h4 class="margin-bottom-2-1">Concepts</h4>
            <ul class="list-unstyled">
              <li v-for="(item, index) in articleConcepts" class="concept">
                <a :href="item.wikiLink" target="_blank" class="h6 margin-bottom-1-2">{{ item.name }}</a>
                <p class="margin-bottom">{{ item.description }}</p>
              </li>
            </ul>

            <div class="article_introduction_lower">

              <h2 class="display-inlineBlock margin-bottom">Student thoughts</h2>

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
                :databaseRef="databaseRef"
                :contributions="articleContributions"
                :article="article"
                v-on:agreesChanged="setArticle" />

            </div>

          </div>

        </grid-block>
      </div>

      <modal
        opaque
        v-if="modalsVisible.articleFinished"
        v-on:close="close('articleFinished')">
        <article-finished
          v-on:close="close('articleFinished')"
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
        articleContributions: [],
        modalsVisible: {
          articleFinished: false,
        },
        dataLoaded: null
      }
    },
    computed: {
      pagesTotal() { return parseInt(this.article.pageTo, 10) - parseInt(this.article.pageFrom, 10) },
      pagesTotal() { return parseInt(this.article.pageTo, 10) - parseInt(this.article.pageFrom, 10) + 1 }, // + 1 to include last page
      articleFinished() { return this.article.finishedBy ? this.article.finishedBy[this.currentUser.uid] : null }
    },
    created() {
      window.Intercom( 'update' )
    },
    mounted() {
      this.particlesInit()
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
        this.databaseRef.ref('articles').on('value', (snapshot) => {
          const data = snapshot.val()
          for ( let article in data ) { if ( article === this.$route.params.articleId ) this.article = data[article] }
        })
      },
      fetchOtherData() {
        this.articleCourses = this.fetchDataRelatedToData('courses', this.article.courses)
        this.articleConcepts = this.fetchDataRelatedToData('concepts', this.article.concepts)
        this.articleContributions = this.fetchDataRelatedToData('contributions', this.article.contributions, true)
        this.dataLoaded = true
      },
      close(modal) {
        this.modalsVisible[modal] = false
        this.setArticle()
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';
  @import '~styles/breakpoints';

  .article {

    &_details,
    &_introduction { margin-top: -$scale-12-1; }

    &_details {
      @include breakpoint('tablet') { margin-top: 0; }}

    &_introduction {
      border-top: 1px solid #f1f1f1;
      margin-top: -112px;
      background: white;
      padding: $scale-5-1 $scale-6-1 $scale-4-1 !important;
      overflow: hidden;

      @include breakpoint('tablet') {
        margin-top: -$scale-6-1;
        margin-left: 0;
        margin-bottom: $scale-4-1;
        padding: $scale-4-1 !important;
      }

      &_lower {
        background: $color-base-lighter-7;
        border-top: 1px solid $color-base-lighter-6;
        padding: inherit;
        margin-top: $scale-6-1;
        margin-left: -$scale-6-1;
        margin-bottom: -$scale-6-1;
        width: calc(100% + #{$scale-12-1});
        display: block;

        @include breakpoint('tablet') {
          margin-left: -$scale-4-1;
          width: calc(100% + #{$scale-8-1});
        }
      }
    }
  }

  .concept {
    margin-bottom: $scale-2-1;
    border-left: 3px solid $color-primary;
    margin-left: -$scale-6-1;
    padding-left: $scale-6-1 - 3px;
  }

</style>
