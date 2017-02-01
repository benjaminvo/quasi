<template>
  <ul class="list-unstyled span-12">
    <h2 class="margin-bottom-4-1">{{ courseName }}</h2>
    <article-list-item
      :currentUser="currentUser"
      v-for="(article, key, index) in articles"
      :toggleArticleFinished="toggleArticleFinished"
      :articleId="key"
      :finished="article.finishedBy ? article.finishedBy[currentUser.uid] : null"
      :title="article.title"
      :author="article.author"
      :pageNum="article.pageTo - article.pageFrom + 1"
      :year="article.year"
      :finishedBy="article.finishedBy"
      :reactions="article.reactions"
      :users="users" />
  </ul>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ArticleListItem from 'components/Article/ListItem'
  export default {
    name: 'ArticleList',
    components: {
      'grid-block': GridBlock,
      'article-list-item': ArticleListItem
    },
    props: {
      currentUser: Object,
      articles: Object,
      courseName: String,
      toggleArticleFinished: Function,
      users: Object
    }
  }
</script>

<style lang="scss" scoped>
</style>
