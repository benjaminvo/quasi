<template>
  <ul class="articleList span-12 margin-bottom-2-1">
    <h2 class="margin-bottom-3-1">{{ courseName }}</h2>
    <article-list-item
      :currentUser="currentUser"
      v-for="(article, key, index) in articles"
      v-on:toggleArticleFinished="toggleArticleFinished"
      :articleId="key"
      :finished="article.finishedBy ? article.finishedBy[currentUser.uid] : null"
      :title="article.title"
      :author="article.author"
      :pageNum="article.pageTo - article.pageFrom"
      :year="article.year" />
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
    list-style: none;

    &_loading {
      font-size: $fontSize-large;
      color: $color-brandLight-darker-1;
      margin-top: $scale-4-1;
      text-align: center;
    }
  }
</style>
