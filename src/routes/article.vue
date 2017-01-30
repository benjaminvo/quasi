<template>
  <div>

    <div v-if="!dataLoaded" class="hidden fadeInWithDelay margin-top-3-1">
      <grid-block>
        <h1 class="color-base-lighter-4">Article on its way!</h1>
      </grid-block>
    </div>

    <div class="hidden" :class="{ fadeIn: dataLoaded }">
      <!-- Article header -->
      <grid-block columns="12">

        <!-- Breadcrumb -->
        <ul class="span-12 margin-bottom fontFamily-body fontSize-base list-unstyled">
          <router-link :to="{ name: 'dashboard' }" tag="li" class="a fontSize-xsmall display-inlineBlock">Dashboard</router-link>
          <li class="fontSize-xsmall display-inlineBlock"><span class="color-base-lighter-3">/ </span><span class="color-base-lighter-1">article</span></li>
        </ul>

        <h1 class="span-12 margin-bottom-8-1">{{ article.title }}</h1>

      </grid-block>

      <div class="backgroundColor-light border-top border-lightGrey">
        <grid-block columns="12">

          <!-- Left column -->
          <div class="article_details span-3">

            <div class="display-flex alignItems-center margin-top margin-bottom-6-1">
              <toggle-checkmark
                small
                class="margin-right-2-1"
                :click="toggleArticleFinished.bind(this, this.$route.params.articleId, article.title, currentUser.uid, currentUser.displayName, 'articleFinished')"
                :checked="article.finishedBy ? article.finishedBy[currentUser.uid] : null" />
              <p class="display-inlineBlock fontSize-small color-dark" v-for="(course, index) in this.articleCourses">Due {{ course.weekday }}</p>
            </div>

            <h6 class="margin-top-8-1 margin-bottom-2-1 color-base-lighter-2 fontWeight-bold">Details</h6>
            <ul class="list-unstyled color-base-lighter-2">
              <li class="margin-bottom-1-2 fontSize-small">{{ article.author }} ({{ article.year }})</li>
              <li class="margin-bottom-1-2 fontSize-small">{{ pagesTotal }} pages ({{ article.pageFrom }} - {{ article.pageTo }})</li>
              <li class="margin-bottom-1-2 fontSize-small">Cited by {{ article.citedBy }}</li>
              <li class="margin-bottom-1-2 fontSize-small">{{ article.journal }}</li>
              <li class="margin-bottom-1-2 fontSize-small">{{ article.publisher }}</li>
            </ul>

            <h6 class="margin-top-4-1 margin-bottom-2-1 color-base-lighter-2 fontWeight-bold">Table of Contents</h6>
            <ul class="list-unstyled color-base-lighter-2">
              <li v-for="(item, key, index) in article.tableOfContents" class="margin-bottom-1-2 fontSize-small">{{ item }}</li>
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
                <p class="display-inlineBlock color-base-lighter-3 fontSize-xlarge margin-left-2-1"
                  v-if="article.reactions"
                  v-for="reaction in article.reactions">
                  <span class="fontSize-xsmall">{{ reaction.count }}</span>
                  <span v-html="reaction.emoji"></span>
                </p>
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
    props: {
      currentUser: Object,
      databaseRef: Object
    },
    mixins: [toggleArticleFinished, fetchDataRelatedToData],
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
      margin-top: -$scale-12-1;
      background: white;
      padding: $scale-5-1 $scale-6-1 !important;
      overflow: hidden;
      padding-bottom: $scale-6-1 !important;

      @include breakpoint('tablet') {
        margin-top: -$scale-6-1;
        margin-left: 0;
        margin-bottom: $scale-4-1;
        padding: $scale-4-1 !important;
        padding-bottom: $scale-6-1 !important;
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
          padding-bottom: $scale-4-1;
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
