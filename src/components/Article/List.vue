<template>
  <ul class="list-unstyled span-12">
    <h2 class="margin-bottom-3-1">{{ courseName }}</h2>
    <article-list-item
      :currentUser="currentUser"
      v-for="(article, key, index) in articles"
      :toggleArticleFinished="toggleArticleFinished"
      :articleId="key"
      :finished="article.finishedBy ? article.finishedBy[currentUser.uid] : null"
      :title="article.title"
      :author="article.author"
      :pageNum="article.pageTo - article.pageFrom"
      :year="article.year"
      :finishedBy="article.finishedBy"
      :reactions="article.reactions"
      :numOfUsers="numOfUsers" />
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
      currentUser: { type: Object },
      articles: { type: Object },
      courseName: { type: String },
      toggleArticleFinished: { type: Function },
      numOfUsers: { type: Number }
    }
  }
</script>

<style lang="scss" scoped>
</style>
