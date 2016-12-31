<template>
  <ul class="articleList span-12 margin-bottom-2-1">
    <h5 class="margin-bottom">{{ courseName }}</h5>
    <article-list-item
      :currentUser="currentUser"
      v-for="(article, key, index) in articles"
      v-on:toggleArticleFinished="toggleArticleFinished"
      :articleId="key"
      :finished="article.finishedBy ? article.finishedBy[currentUser.uid] : null"
      :title="article.title"
      :author="article.author" />
  </ul>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ArticleListItem from 'components/Article/ListItem'
  export default {
    components: {
      'grid-block': GridBlock,
      'article-list-item': ArticleListItem
    },
    props: {
      currentUser: { type: Object },
      articles: { type: Object },
      courseName: { type: String }
    },
    methods: {
      toggleArticleFinished(e) {
        this.$emit('toggleArticleFinished', e)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/global';

  .articleList {
    &_loading {
      font-size: $fontSize-large;
      color: $color-brandLight-darker-1;
      margin-top: $scale-4-1;
      text-align: center;
    }
  }
</style>
