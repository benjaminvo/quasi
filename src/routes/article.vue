<template>
  <div>
    <!-- Article header -->
    <grid-block columns="12">

      <!-- Breadcrumb -->
      <ul class="span-12 margin-bottom-2-1 fontFamily-body fontSize-base list-unstyled textTransform-uppercase">
        <router-link :to="{ name: 'dashboard' }" tag="li" class="a fontSize-xsmall display-inlineBlock">Dashboard</router-link>
        <li class="fontSize-xsmall display-inlineBlock"><span class="color-base-lighter-3">/ </span><span class="color-base-lighter-1">article</span></li>
      </ul>

      <h1 class="span-12 margin-bottom-6-1">{{ article.meta ? article.meta.title : null }}</h1>

    </grid-block>

    <div class="backgroundColor-light border-top border-lightGrey">
      <grid-block columns="12">

        <!-- Left column -->
        <div class="article_details span-3">

          <div class="display-flex alignItems-center margin-top">
            <toggle-checkmark
              small
              class="margin-right"
              :toggleArticleFinished="toggleArticleFinished"
              :finished="article.finishedBy ? article.finishedBy[currentUser.uid] : null" />
            <p class="display-inlineBlock fontSize-xsmall color-dark" v-for="(course, index) in this.articleCourses">Due {{ course.weekday }}</p>
          </div>

          <h6 class="margin-top-6-1 margin-bottom color-base-lighter-2">Details</h6>
          <ul class="list-unstyled color-base-lighter-2">
            <li v-for="(item, key, index) in article.meta" class="margin-bottom-1-2 fontSize-xsmall">
              <span v-if="key === 'pages'">{{ pagesTotal }} pages ({{ item.from }} - {{ item.to }})</span>
              <span v-else-if="key === 'citedBy'">Cited by {{ item }}</span>
              <span v-else-if="key !== 'title'">{{ item }}</span>
            </li>
          </ul>

          <h6 class="margin-bottom margin-top-3-1 color-base-lighter-2">Table of Contents</h6>
          <ul class="list-unstyled color-base-lighter-2">
            <li v-for="(item, key, index) in article.tableOfContents" class="margin-bottom-1-2 fontSize-xsmall">{{ item }}</li>
          </ul>

        </div>

        <!-- Right column -->
        <div class="article_introduction span-9 card card-2">

          <h2 class="margin-bottom-4-1">Reading guide</h2>
          <ul class="list-unstyled">
            <li v-for="(item, key, index) in article.teacherNotes" v-if="key !== 'concepts'" class="margin-bottom">
              <h4 class="margin-bottom-1-2">{{ item.title }}</h4>
              <p class="margin-bottom-3-1">{{ item.text }}</p>
            </li>
          </ul>

          <h4 class="margin-bottom">Concepts</h4>
          <ul class="list-unstyled">
            <li v-for="(item, index) in articleConcepts" class="concept">
              <a :href="item.wikiLink" class="h6 margin-bottom-1-2">{{ item.name }}</a>
              <p class="margin-bottom">{{ item.description }}</p>
            </li>
          </ul>

          <div class="article_introduction_lower">

            <h2 class="display-inlineBlock margin-bottom">Student thoughts</h2>

            <div class="float-right">
              <p class="display-inlineBlock color-base-lighter-3 fontSize-xlarge margin-left-2-1"
                v-if="article.readerEmojiReactions"
                v-for="reaction in article.readerEmojiReactions">
                <span class="fontSize-xsmall">{{ reaction.count }}</span>
                &#128526; <!-- Put reaction.emoji here when ready in new data structure -->
              </p>
            </div>

            <div class="clear-both margin-bottom-2-1"></div>

            <contribution-block
              :currentUser="currentUser"
              :databaseRef="databaseRef"
              :contributions="readerChallenges"
              type="challenge"
              articleReaderContributionsPathEndpoint="readerChallenges"
              userContributionsPathEndpoint="challenges"
              inputPlaceholder="Your thoughts on the text. Frustrations, aha-moments etc." />

          </div>

        </div>

      </grid-block>
    </div>

    <modal
      v-if="modalVisible"
      v-on:close="closeModal"
      :currentUser="currentUser"
      :databaseRef="databaseRef"
      :articleId="this.$route.params.articleId" />

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ContributionBlock from 'components/ContributionBlock'
  import ToggleCheckmark from 'components/ToggleCheckmark'
  import Modal from 'components/Modal'
  import { fetchDataRelatedToData } from 'utils/fetchDataRelatedToData'
  export default {
    name: 'ArticleRoute',
    components: {
      'grid-block': GridBlock,
      'contribution-block': ContributionBlock,
      'toggle-checkmark': ToggleCheckmark,
      'modal': Modal
    },
    props: {
      currentUser: Object,
      databaseRef: Object
    },
    mixins: [fetchDataRelatedToData],
    data() {
      return {
        article: {},
        articleCourses: [],
        articleConcepts: [],
        readerChallenges: [],
        modalVisible: false
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
      },
      toggleArticleFinished() {
        const articleId = this.$route.params.articleId
        const articleFinishedByPath = 'articles/' + articleId + '/finishedBy/'
        const articleFinishedPath = 'users/' + this.currentUser.uid + '/articles/' + articleId + '/finished'

        this.databaseRef.ref(articleFinishedPath).once('value', (snapshot) => {
          const data = snapshot.val()
          if (data === false || data === null || !data) {
            this.databaseRef.ref(articleFinishedPath).set(true)
            this.databaseRef.ref(articleFinishedByPath + '/' + this.currentUser.uid).set(true)
            this.modalVisible = true

            // Add notification about finished article to notifications node on database
            this.databaseRef.ref('articles/' + articleId).once('value', (snapshot) => {
              const notification = {
                type: 'articleFinished',
                timestamp: new Date().getTime(),
                article: {
                  id: articleId,
                  title: snapshot.val().meta.title
                },
                user: {
                  id: this.currentUser.uid,
                  name: this.currentUser.displayName
                }
              }
              this.databaseRef.ref('notifications').push(notification)
            })

          } else {
            this.databaseRef.ref(articleFinishedPath).set(false)
            this.databaseRef.ref(articleFinishedByPath + '/' + this.currentUser.uid).set(false)
          }
        })
        this.setArticle()
      },
      closeModal() {
        this.modalVisible = false
        this.setArticle()
      }
    }
  }
</script>

<style lang="scss">

  @import '~styles/global';
  @import '~styles/card';

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
