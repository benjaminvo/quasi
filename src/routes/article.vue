<template>
  <div>
    <grid-block columns="12">

      <!-- Breadcrumb -->
      <div class="span-12 padding-bottom-2-1 fontFamily-body fontSize-base">
        <router-link
          :to="{ name: 'dashboard' }"
          tag="a"
          class="textTransform-uppercase">Dashboard</router-link> / {{ article.title }} ({{ article.year }})
      </div>

      <!-- Article title -->
      <div class="span-12 padding-bottom-4-1">
        <h1>{{ article.title }}</h1>
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
        <div class="padding-2-1">
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
      <div class="article-meta span-9">

        <!-- Reading guide -->
        <h5 class="padding-bottom-2-1">Reading guide</h5>
        <p class="padding-bottom-4-1">{{ article.readingGuide }}</p>

        <!-- Abstract -->
        <h5 class="padding-bottom-2-1">Abstract</h5>
        <p class="padding-bottom-4-1">{{ article.abstract }}</p>
      </div>

    </grid-block>
  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  export default {
  components: { 'grid-block': GridBlock },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
    },
    data() {
      return {
        article: {}
      }
    },
    computed: {
      pagesTotal() {
        return parseInt(this.article.pageTo, 10) - parseInt(this.article.pageFrom, 10)
      }
    },
    created() {
      this.setArticle()
    },
    watch: {
      '$route': 'setProject'
    },
    methods: {
      setArticle() {
        const activeArticleId = this.$route.params.articleId
        this.databaseRef.ref('articles/').on('value', (snapshot) => {
          let articleObj = {}
          const data = snapshot.val()
          for (let article in data) {
            if (article === activeArticleId) {
              articleObj = data[article]
            }
          }
          this.article = articleObj
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/global';

  .article-meta {
    height: 100px;
  }
</style>
